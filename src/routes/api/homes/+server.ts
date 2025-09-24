import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/supabaseClient';

type Home = {
    id: string;
    address1: string;
    address2: string
    city: string;
    state: string;
    zip: string;
    contacts: {
        isPrimary: boolean;
        name: string;
    }[];
    max_days_stay: number;
    project: {
        id: string;
        friendly_name: string;
        full_address: string;
        region: number;
    }[]
    assignments: Assignment[];
    congregation: string;
    occupant_type: string | null;
    distance_to_project: number;
}

type Assignment = {
    volunteer: Volunteer;
}

type Volunteer = {
    id: string;
    name: string;
    date_start: string;
    date_end: string;
}

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
                volunteer:volunteers (
                    id,
                    name,
                    date_start,
                    date_end
                )
            ),
            congregation,
            occupant_type,
            distance_to_project
        `)
        .eq('project.region', locals.user?.assignedRegion)
        .overrideTypes<Home[]>();

    if (error) {
        console.error('Error fetching homes:', error);
        return json({ error: error.message }, { status: 500 });
    }

    // Filter only primary contacts for each home
    const homes = data.map(home => {
        const primaryContacts = home.contacts
            .filter(contact => contact.isPrimary)
            .map(contact => contact.name);

        let sortedAssignments: Assignment[] = home.assignments.length
            ? home.assignments.sort((a: any, b: any) => {
                const dateA = new Date(a.date_end);
                const dateB = new Date(b.date_end);
                return dateB.getTime() - dateA.getTime();
            })
            : []

        const today = new Date();

        let hasAssignmentNow = sortedAssignments[0]
            ? today >= new Date(sortedAssignments[0].volunteer.date_start) && today <= new Date(sortedAssignments[0].volunteer.date_end)
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
            hasAssignmentNow,
            occupantType: home.occupant_type,
            maxDaysStay: home.max_days_stay,
            distanceToProject: home.distance_to_project
        };
    });

    return json(homes);
}

export async function DELETE({ request }) {
    const homeId = await request.json();

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


export async function POST({ request }) {
    const body = await request.json();

    if (!body) {
        return json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log(body)

    const { error } = await supabase.from('homes').insert([body]);

    if (error) {
        return json({ error: 'Failed to add home' }, { status: 500 });
    }

    return json({ success: true }, { status: 201 });
}