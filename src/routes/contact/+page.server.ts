import { supabase } from "$lib/supabase";
import { fail, redirect } from "@sveltejs/kit";

export async function load() {
  const { data, error } = await supabase.from("contactform").select();
  
  if (error) {
    console.error("Load error:", error);
  }
  
  return {
    contactform: data || []
  };
}

export const actions = {
  default: async ({ request }) => {
    const form = await request.formData();

    const name = form.get("name");
    const email = form.get("email");
    const phonenumber = form.get("phonenumber");
    const message = form.get("message");

    const { error } = await supabase.from("contactform").insert([
      { name, email, phonenumber, message }
    ]);

    if (error) {
      console.error("Insert error:", error);
      return fail(500, { error: "Failed to send message" });
    }

    // Optional redirect or success indicator
    throw redirect(303, '/welcome');
  }
};