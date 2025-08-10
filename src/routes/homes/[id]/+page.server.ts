import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
    const homeResponse = await fetch(`/api/homes/${params.id}`);
    const homeById = await homeResponse.json();

    const contactsRes = await fetch(`/api/homes/${params.id}/contacts`);
    const contacts = await contactsRes.json();

    const assignmentsRes = await fetch(`/api/homes/${params.id}/assignedVolunteers`);
    const assignments = await assignmentsRes.json();

    let home = {
        id: homeById.id,
        ...homeById,
        contacts,
        assignments
    }

    return home;
}
