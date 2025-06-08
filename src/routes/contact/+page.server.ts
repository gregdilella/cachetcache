import { supabase } from "$lib/supabase";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from './$types';

export async function load() {
  const { data, error } = await supabase.from("contactform").select();
  
  if (error) {
    console.error("Load error:", error);
  }
  
  return {
    contactform: data || []
  };
}

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await request.formData();

    const name = form.get("name");
    const email = form.get("email");
    const phonenumber = form.get("phonenumber");
    const message = form.get("message");

    // Validate required fields
    if (!name || !email || !message) {
      return fail(400, { error: "Name, email, and message are required" });
    }

    const { error } = await supabase.from("contactform").insert([
      { 
        name: name as string, 
        email: email as string, 
        phone_number: phonenumber as string, // Map phonenumber to phone_number for database
        message: message as string 
      }
    ]);

    if (error) {
      console.error("Insert error:", error);
      return fail(500, { error: "Failed to send message" });
    }

    // Optional redirect or success indicator
    throw redirect(303, '/welcome');
  }
};