import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
    const homeResponse = await fetch(`/api/homes?id=${params.id}`);
    const homeResponseJson = await homeResponse.json();

    let home = {
        id: homeResponseJson.id,
        ...homeResponseJson,
    }

    return home;
}
