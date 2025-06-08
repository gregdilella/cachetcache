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
	signin: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		console.log('Signin attempt for email:', email);

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required', email });
		}

		console.log('Attempting Supabase signin...');
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		console.log('Supabase signin result:', { data: !!data, error: error?.message });

		if (error) {
			console.error('Signin error:', error);
			return fail(401, { error: `Authentication failed: ${error.message}`, email });
		}

		if (!data.user) {
			console.error('No user returned from Supabase');
			return fail(500, { error: 'Authentication failed', email });
		}

		console.log('Signin successful for user:', data.user.id);
		// Redirect to dashboard (which will redirect to the user's profile)
		throw redirect(303, '/dashboard');
	}
}; 