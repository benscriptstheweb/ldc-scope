import { adminDb } from '$lib/firebase/admin';
import { json } from '@sveltejs/kit';

export async function PATCH({ params, request }) {
    const { homeId } = params;
    const body = await request.json();

    if (!body.address1 || !body.city || !body.state || !body.zip) {
        return json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        await adminDb
            .collection('homes')
            .doc(homeId)
            .update({
                address1: body.address1,
                address2: body.address2,
                city: body.city,
                state: body.state,
                zip: body.zip
            });

        return json({ success: true }, { status: 201 });
    } catch (err) {
        console.error(err);
        return json({ error: 'Failed to add contact' }, { status: 500 });
    }
}

export async function GET({ params }) {
    const { homeId } = params;
    const homeSnap = await adminDb
        .collection('homes')
        .doc(homeId)
        .get();
    const homeData = homeSnap.data();

    // attached volunteers :: will deprecate 
    const volunteerSnap = await adminDb
        .collection('homes')
        .doc(homeId)
        .collection('volunteers')
        .get();

    const volunteerData = volunteerSnap.docs.map((doc) => {
        return {
            name: doc.data().name,
            dateStart: Intl.DateTimeFormat('en-CA').format(doc.data().dateStart.toDate()),
            dateEnd: Intl.DateTimeFormat('en-CA').format(doc.data().dateEnd.toDate())
        }
    });
    // attached volunteers :: will deprecate

    const home = {
        id: homeId,
        address1: homeData?.address1,
        address2: homeData?.address2,
        city: homeData?.city,
        state: homeData?.state,
        zip: homeData?.zip,
        amenities: homeData?.amenities,
        volunteers: volunteerData,
    }

    return json(home);
}