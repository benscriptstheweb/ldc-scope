import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
    const volunteersResponse = await fetch(`/api/volunteers/${params.id}`);
    const volunteerById = await volunteersResponse.json();

    let volunteer = {
        id: volunteerById.id,
        ...volunteerById,
    }

    return volunteer;
}
