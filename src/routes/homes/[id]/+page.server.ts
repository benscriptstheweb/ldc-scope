import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
    const homeResponse = await fetch(`/api/homes/${params.id}`);
    const contactsRes = await fetch(`/api/homes/${params.id}/contacts`);
    const homeById = await homeResponse.json();
    const contacts = await contactsRes.json();

    let home = {
        id: homeById.id,
        ...homeById,
        contacts
    }

    return home;
}
