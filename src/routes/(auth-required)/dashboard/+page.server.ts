import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session, user } = await safeGetSession();

	if (!session || !user) {
		throw redirect(303, '/signin');
	}

	// Redirect to the user's profile page
	throw redirect(303, `/dashboard/${user.id}`);
}; 