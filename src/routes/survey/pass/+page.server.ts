import { PASS } from "$env/static/private";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({ cookies }) => {
    const surveyAuth = cookies.get('survey_auth');

    if (surveyAuth === 'ok') {
        throw redirect(303, '/survey');
    }

    return {
        formData: { example: 'Server-preloaded data' }
    };
};

export const actions: Actions = {
    unlock: async ({ request, cookies }) => {
        const data = await request.formData();
        const password = data.get('password');

        if (password === PASS) {
            cookies.set('survey_auth', 'ok', {
                path: '/survey',
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 60 * 5
            });
            throw redirect(303, '/survey');
        }

        return fail(400, { error: 'Wrong password' });
    }
};
