import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	
	// If already signed in, redirect to blog
	if (session) {
		throw redirect(303, '/blog');
	}
};

export const actions: Actions = {
	signup: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirm-password') as string;
		
		// Profile information
		const name = formData.get('name') as string;
		const phone = formData.get('phone') as string;
		const birthdate = formData.get('birthdate') as string;
		const sex = formData.get('sex') as string;

		if (!email || !password || !confirmPassword || !name) {
			return fail(400, { 
				error: 'Email, password, and name are required', 
				email, name, phone, birthdate, sex 
			});
		}

		if (password !== confirmPassword) {
			return fail(400, { 
				error: 'Passwords do not match', 
				email, name, phone, birthdate, sex 
			});
		}

		if (password.length < 6) {
			return fail(400, { 
				error: 'Password must be at least 6 characters long', 
				email, name, phone, birthdate, sex 
			});
		}

		const { data, error } = await supabase.auth.signUp({
			email,
			password
		});

		if (error) {
			if (error.message.includes('rate limit')) {
				return fail(429, { 
					error: 'Too many signup attempts. Please wait a few minutes and try again.', 
					email, name, phone, birthdate, sex 
				});
			} else if (error.message.includes('User already registered')) {
				return fail(400, { 
					error: 'An account with this email already exists. Try signing in instead.', 
					email, name, phone, birthdate, sex 
				});
			} else {
				return fail(400, { 
					error: `Failed to create account: ${error.message}`, 
					email, name, phone, birthdate, sex 
				});
			}
		}

		if (!data.user) {
			return fail(500, { 
				error: 'Failed to create account. Please try again.', 
				email, name, phone, birthdate, sex 
			});
		}

		// Calculate age from birthdate if provided
		let age = null;
		if (birthdate) {
			const today = new Date();
			const birth = new Date(birthdate);
			age = today.getFullYear() - birth.getFullYear();
			const monthDiff = today.getMonth() - birth.getMonth();
			if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
				age--;
			}
		}

		// Update profile information (the trigger already created a basic profile)
		// Wait a moment for the trigger to complete
		await new Promise(resolve => setTimeout(resolve, 100));
		
		const { error: profileError } = await supabase
			.from('user_profile')
			.update({
				name: name.trim(),
				phone_number: phone ? phone.trim() : null,
				birthdate: birthdate || null,
				age: age,
				sex: sex || null,
				is_admin: false,
				updated_at: new Date().toISOString()
			})
			.eq('id', data.user.id);

		if (profileError) {
			console.error('Error updating user profile:', profileError);
			// Note: User is already created in auth, but profile failed
			// We could either try to clean up or let them complete profile later
			return fail(500, { 
				error: 'Account created but failed to save profile information. Please contact support.', 
				email, name, phone, birthdate, sex 
			});
		}

		// Check if email confirmation is required
		if (!data.session) {
			// Redirect to signin with success message
			throw redirect(303, '/signin?message=Account created successfully! Please check your email to confirm your account before signing in.');
		}

		// If no email confirmation is required, redirect to signin
		throw redirect(303, '/signin?message=Account created successfully! Please sign in to access your timeline.');
	}
}; 