import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
    const surveyAuth = cookies.get('survey_auth');

    if (surveyAuth !== 'ok') {
        throw redirect(303, '/survey/pass');
    }

    return {
        formData: { example: 'Server-preloaded data' }
    };
};
