import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
    const homeResponse = await fetch(`/api/homes/${params.id}`);
    const homeById = await homeResponse.json();

    let home = {
        id: homeById.id,
        ...homeById,
    }

    return home;
}
