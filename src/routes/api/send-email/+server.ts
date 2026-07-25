import { Resend } from 'resend';
import { RESEND_API_KEY } from "$env/static/private";
import { json } from '@sveltejs/kit';
import { htmlBody } from './styles.js';

const resend = new Resend(RESEND_API_KEY);

export async function POST({ request }) {
  const body = await request.json();

  const { error } = await resend.emails.send({
    from: "noreply@lacasamorada.org",
    to: body.emails,
    // cc: ["ldchousingr7@gmail.com", "bayarearp2006@gmail.com"],
    cc: ["ldchousingr7@gmail.com"],
    subject: "Host Occupant Guidelines",
    html: htmlBody(body),
  });

  if (error) {
    return json({ message: error.message }, { status: 403 });
  }
  return json({ message: 'Email success' }, { status: 200 });
}
