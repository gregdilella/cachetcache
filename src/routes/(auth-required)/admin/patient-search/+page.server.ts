import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createSupabaseAdminClient } from '$lib/supabase.server';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { session, user } = await safeGetSession();

	if (!session || !user) {
		throw redirect(303, '/signin');
	}

	// Get user profile to check admin status
	const { data: userProfile, error: profileError } = await supabase
		.from('user_profile')
		.select('is_admin')
		.eq('id', user.id)
		.single();

	if (profileError || !userProfile?.is_admin) {
		throw error(403, 'Access denied. Admin privileges required.');
	}

	let users = [];
	let usersError = null;

	try {
		// Try to use admin client to fetch all users (bypasses RLS)
		const adminSupabase = createSupabaseAdminClient();
		const result = await adminSupabase
			.from('user_profile')
			.select(`
				id,
				name,
				phone_number,
				sex,
				age,
				birthdate,
				created_at,
				updated_at
			`)
			.order('created_at', { ascending: false });
		
		users = result.data || [];
		usersError = result.error;
	} catch (adminError) {
		console.error('Admin client failed, trying fallback:', adminError);
		
		// Fallback: Use regular client (will only show users visible to current user)
		const result = await supabase
			.from('user_profile')
			.select(`
				id,
				name,
				phone_number,
				sex,
				age,
				birthdate,
				created_at,
				updated_at
			`)
			.order('created_at', { ascending: false });
		
		users = result.data || [];
		usersError = result.error;
	}

	if (usersError) {
		console.error('Error fetching users:', usersError);
		throw error(500, 'Failed to fetch user data');
	}

	return {
		users: users || []
	};
}; 