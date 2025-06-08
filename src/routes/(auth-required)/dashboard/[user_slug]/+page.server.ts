import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase }, params }) => {
	const { session, user } = await safeGetSession();

	if (!session || !user) {
		throw redirect(303, '/signin');
	}

	// Get the user profile from the database (using the authenticated user's ID, not the slug)
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
			throw error(500, 'Failed to create user profile');
		}

		userProfile = newProfile;
	} else if (profileError) {
		console.error('Error loading user profile:', profileError);
		throw error(500, 'Failed to load user profile');
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
		userProfile: userProfile || null,
		user_slug: params.user_slug
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
		const dateOfBirth = formData.get('date_of_birth') as string;

		// Calculate age from date of birth if provided
		let age: number | null = null;
		if (dateOfBirth) {
			const birthDate = new Date(dateOfBirth);
			const today = new Date();
			age = today.getFullYear() - birthDate.getFullYear();
			const monthDiff = today.getMonth() - birthDate.getMonth();
			if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
				age--;
			}
		}

		// Also allow direct age input for backward compatibility
		if (!age && formData.get('age')) {
			age = parseInt(formData.get('age') as string);
		}

		// Validate required fields
		if (!name?.trim()) {
			return fail(400, { error: 'Name is required' });
		}

		// Validate sex selection
		if (sex && !['Male', 'Female', 'Other'].includes(sex)) {
			return fail(400, { error: 'Invalid sex selection' });
		}

		// Validate age
		if (age !== null && (age < 0 || age > 150)) {
			return fail(400, { error: 'Invalid age or date of birth' });
		}

		// Update the user profile
		const updateData: any = {
			name: name.trim(),
			phone_number: phoneNumber?.trim() || null,
			sex: sex || null,
			age: age,
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