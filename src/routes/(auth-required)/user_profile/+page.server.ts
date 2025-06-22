import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

// Helper function to calculate age from birthdate
function calculateAge(birthdate: string): number | null {
	if (!birthdate) return null;
	const today = new Date();
	const birth = new Date(birthdate);
	let age = today.getFullYear() - birth.getFullYear();
	const monthDiff = today.getMonth() - birth.getMonth();
	
	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
		age--;
	}
	
	return age;
}

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { session, user } = await safeGetSession();

	if (!session || !user) {
		throw redirect(303, '/signin');
	}

	// Get the user profile from the database
	let { data: userProfile, error: profileError } = await supabase
		.from('user_profile')
		.select('*')
		.eq('id', user.id)
		.single();

	// If user profile doesn't exist, create it
	if (profileError && profileError.code === 'PGRST116') { // PGRST116 is "not found"
		console.log('User profile not found, creating new profile for user:', user.id);
		
		const { data: newProfile, error: createError } = await supabase
			.from('user_profile')
			.insert({
				id: user.id,
				email: user.email,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			})
			.select()
			.single();

		if (createError) {
			console.error('Error creating user profile:', createError);
			throw fail(500, { error: 'Failed to create user profile' });
		}

		userProfile = newProfile;
	} else if (profileError) {
		console.error('Error loading user profile:', profileError);
		throw fail(500, { error: 'Failed to load user profile' });
	}

	// Make sure email is up to date if it's missing
	if (userProfile && !userProfile.email && user.email) {
		const { error: updateError } = await supabase
			.from('user_profile')
			.update({ email: user.email, updated_at: new Date().toISOString() })
			.eq('id', user.id);

		if (!updateError) {
			userProfile.email = user.email;
		}
	}

	return {
		userProfile,
		session,
		user
	};
};

export const actions: Actions = {
	updateProfile: async ({ request, locals: { safeGetSession, supabase } }) => {
		const { session, user } = await safeGetSession();

		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const phoneNumber = formData.get('phone_number') as string;
		const sex = formData.get('sex') as string;
		const birthdate = formData.get('birthdate') as string;

		// Validate required fields
		if (!name?.trim()) {
			return fail(400, { error: 'Name is required' });
		}

		// Validate sex selection
		if (sex && !['Male', 'Female', 'Other'].includes(sex)) {
			return fail(400, { error: 'Invalid sex selection' });
		}

		// Validate birthdate
		if (birthdate) {
			const birth = new Date(birthdate);
			const today = new Date();
			
			if (birth > today) {
				return fail(400, { error: 'Birthdate cannot be in the future' });
			}
			
			// Check if birthdate is reasonable (not more than 150 years ago)
			const maxAge = new Date();
			maxAge.setFullYear(maxAge.getFullYear() - 150);
			
			if (birth < maxAge) {
				return fail(400, { error: 'Invalid birthdate' });
			}
		}

		// Calculate age from birthdate
		const calculatedAge = calculateAge(birthdate);

		// Update the user profile
		const updateData: any = {
			name: name.trim(),
			phone_number: phoneNumber?.trim() || null,
			sex: sex || null,
			birthdate: birthdate || null,
			age: calculatedAge, // Store calculated age
			updated_at: new Date().toISOString()
		};

		const { error: updateError } = await supabase
			.from('user_profile')
			.update(updateData)
			.eq('id', user.id);

		if (updateError) {
			console.error('Error updating user profile:', updateError);
			return fail(500, { error: 'Failed to update profile. Please try again.' });
		}

		return { success: true };
	}
}; 