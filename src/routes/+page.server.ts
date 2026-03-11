import { getProjectsByRegion } from "$lib/helpers/getProjects";
import type { PageServerLoad } from "./homes/[id]/$types";

export const load: PageServerLoad = async ({ fetch, locals }) => {
    const res = await fetch('/api/homes');
    const homes = await res.json();

    let projectsByRegion = [];

    if (locals.user) {
        const projectsRes = await fetch(`/api/projects?regionNumber=${locals.user.assignedRegion}`);
        projectsByRegion = await projectsRes.json()
    }

    return { homes, projectsByRegion }
}
