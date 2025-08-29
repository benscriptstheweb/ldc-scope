import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/supabaseClient';

export async function GET({ locals }) {
    const { data, error } = await supabase
        .from('homes')
        .select(`
            id,
            address1,
            address2,
            city,
            state,
            zip,
            contacts ( isPrimary, name ),
            max_days_stay,
            project!inner ( id, friendly_name, full_address, region ),
            assignments (
                volunteers (
                    id,
                    name,
                    date_start,
                    date_end
                )
            ),
            congregation
        `)
        .eq('project.region', locals.user?.assignedRegion);

    if (error) {
        console.error('Error fetching homes:', error);
        return json({ error: error.message }, { status: 500 });
    }

    // Filter only primary contacts for each home
    const homes = data.map(home => {
        const primaryContacts = home.contacts
            .filter(contact => contact.isPrimary)
            .map(contact => contact.name);

        let sortedAssignments = home.assignments.length
            ? home.assignments.sort((a: any, b: any) => {
                const dateA = new Date(a.date_end);
                const dateB = new Date(b.date_end);
                return dateB.getTime() - dateA.getTime();
            })
            : []

        const today = new Date();

        let hasAssignmentNow = sortedAssignments[0]
            ? today >= new Date(sortedAssignments[0].volunteers.date_start) && today <= new Date(sortedAssignments[0].volunteers.date_end)
            : false

        return {
            id: home.id,
            address1: home.address1,
            address2: home.address2,
            city: home.city,
            state: home.state,
            zip: home.zip,
            primaryContacts,
            congregation: home.congregation,
            hasAssignmentNow
        };
    });

    return json(homes);
}

export async function DELETE({ request }) {
    const { homeId } = await request.json();

    const { error } = await supabase
        .from('homes')
        .delete()
        .eq('id', homeId);

    if (error) {
        console.error('Error deleting home: ', error);
        throw error;
    }

    return json({ status: 'deleted' });
}
