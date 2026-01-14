export function getParsedDate(date: any) {
    const [y, m, d] = date.split('-');

    return new Date(y, m - 1, d).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

}