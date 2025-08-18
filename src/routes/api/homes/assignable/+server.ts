import { json } from "@sveltejs/kit";
import { supabase } from "$lib/supabase/supabaseClient";

export async function GET() {
    const { data, error } = await supabase
        .from('homes')
        .select('id, address1, address2, city, state, zip')

    if (error) {
        console.error('Error fetching assignable homes:', error);
        return json({ error: error.message }, { status: 500 });
    }

    return json(data);
}