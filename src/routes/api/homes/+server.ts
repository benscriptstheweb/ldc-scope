import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/supabaseClient';

export async function GET() {
    const { data, error } = await supabase
        .from('homes')
        .select(`
      id,
      address1,
      address2,
      city,
      state,
      zip,
      isAssigned,
      contacts (
        isPrimary,
        name
      )
    `);

    if (error) {
        console.error('Error fetching homes:', error);
        return json({ error: error.message }, { status: 500 });
    }

    // Filter only primary contacts for each home
    const homes = data.map(home => {
        const primaryContacts = home.contacts
            .filter(contact => contact.isPrimary)
            .map(contact => contact.name);

        return {
            id: home.id,
            address1: home.address1,
            address2: home.address2,
            city: home.city,
            state: home.state,
            zip: home.zip,
            isAssigned: home.isAssigned,
            primaryContacts
        };
    });

    return json(homes);
}
