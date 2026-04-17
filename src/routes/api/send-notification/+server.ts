import { Resend } from 'resend';
import { RESEND_API_KEY } from "$env/static/private";
import { json } from '@sveltejs/kit';
import { getParsedDate } from '$lib/helpers/getParsedDate.js';

const resend = new Resend(RESEND_API_KEY);

export async function POST({ request }) {
  const body = await request.json();

  const htmlBody = `
    <p>
      Please note that the following housing request has been made:
    </p>

    <ul>
      <li>Name: ${body.name}</li>
      <li>Occupant type: ${body.type}</li>
      <li>Phone: ${body.phone}</li>
      <li>Email: ${body.email}</li>
      <li>Project: ${body.project}</li>
      <li>Date range: ${getParsedDate(body.date_start)} to ${getParsedDate(body.date_end)}</li>
    </ul>

    <p>
      <strong>Special considerations:</strong>
    </p>
    <p>
      ${body.allergies_notes}
    </p>
    </p>
  `;

  const { error } = await resend.emails.send({
    from: "noreply@lacasamorada.org",
    to: "ldchousingr7@gmail.com",
    subject: "LDC Housing Requests - Region 7 - New Response Received",
    html: htmlBody,
  });

  if (error) {
    return json({ message: error.message }, { status: 403 });
  }
  return json({ message: 'Email success' }, { status: 200 });
}