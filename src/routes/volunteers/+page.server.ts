export const load = async ({ fetch }) => {
    const res = await fetch('/api/volunteers');
    const volunteers = await res.json();

    return { volunteers }
}
