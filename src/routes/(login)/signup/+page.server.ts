import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	
	// If already signed in, redirect to dashboard
	if (session) {
		throw redirect(303, '/dashboard');
	}
};

export const actions: Actions = {
	signup: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirm-password') as string;

		if (!email || !password || !confirmPassword) {
			return fail(400, { error: 'All fields are required', email });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match', email });
		}

		if (password.length < 6) {
			return fail(400, { error: 'Password must be at least 6 characters long', email });
		}

		const { data, error } = await supabase.auth.signUp({
			email,
			password
		});

		if (error) {
			if (error.message.includes('rate limit')) {
				return fail(429, { error: 'Too many signup attempts. Please wait a few minutes and try again.', email });
			} else if (error.message.includes('User already registered')) {
				return fail(400, { error: 'An account with this email already exists. Try signing in instead.', email });
			} else {
				return fail(400, { error: `Failed to create account: ${error.message}`, email });
			}
		}

		if (!data.user) {
			return fail(500, { error: 'Failed to create account. Please try again.', email });
		}

		// Check if email confirmation is required
		if (!data.session) {
			return {
				success: true,
				message: 'Please check your email to confirm your account before signing in.'
			};
		}

		// If no email confirmation is required, redirect to dashboard
		throw redirect(303, '/dashboard');
	}
}; 