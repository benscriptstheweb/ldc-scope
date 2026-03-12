export async function getProjects() {
    const res = await fetch(`/api/projects`);
    const allProjects = await res.json();
    return allProjects;
}

export async function getProjectsByRegion(region: number) {
    const res = await fetch(`/api/projects?regionNumber=${region}`);
    const allProjectsByRegion = await res.json();
    return allProjectsByRegion;
}
