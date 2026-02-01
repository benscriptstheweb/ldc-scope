export async function uploadImages(imageFiles: File[], homeId: string) {
    const form = new FormData();
    imageFiles.forEach((file) => form.append('images', file));

    const response = await fetch(`/api/homes/${homeId}/photos`, {
        method: 'POST',
        body: form
    });

    return response;
}
