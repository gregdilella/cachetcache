import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";


export const load: LayoutServerLoad = async (
    { locals: { safeGetSession, supabase }, cookies },
) => {
    const { session, user } = await safeGetSession();

    let userProfile = null;
    
    // If user is authenticated, fetch their profile
    if (session && user) {
        const { data: profile } = await supabase
            .from('user_profile')
            .select('*')
            .eq('id', user.id)
            .single();
        
        userProfile = profile;
    }

    return {
        session,
        userProfile,
        cookies: cookies.getAll(),
    };
};
