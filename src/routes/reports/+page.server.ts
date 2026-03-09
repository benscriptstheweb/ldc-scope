import { supabase } from "$lib/supabase/supabaseClient";
import { json } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async () => {
    const { data, error } = await supabase
        .from('homes')
        .select('city');

    if (error) {
        return json({ error: 'cannot get homes' }, { status: 500 })
    }

    const cityCounts = data.reduce((acc: any, home: any) => {
        acc[home.city] = (acc[home.city] || 0) + 1;
        return acc;
    }, {});

    return {
        cities: Object.entries(cityCounts).map(([city, count]) => ({
            city,
            count
        }))
    }
}
