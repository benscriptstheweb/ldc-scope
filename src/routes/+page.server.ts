import type { PageServerLoad } from "./homes/[id]/$types";

export const load: PageServerLoad = async ({ fetch }) => {
    const res = await fetch('/api/homes');
    const homes = await res.json();
    return { homes }
}
