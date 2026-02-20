import { Resend } from 'resend';
import { RESEND_API_KEY } from "$env/static/private";
import { json } from '@sveltejs/kit';

const resend = new Resend(RESEND_API_KEY);

export async function POST({ request }) {
    const body = await request.json();

    const htmlBody = `
    <p>Dear Friends,</p>

    <p>
      By way of introduction, included in this email is ${body.name} 
      who is visiting from ${body.date_start} to ${body.date_end} 
      to assist with the ${body.projectName} project.
    </p>

    <p>${body.name}'s contact information:<br>
    <strong>Mobile: </strong> ${body.phone}</p>

    <p>Also included in this email is the host ${body.hostName}, who will be providing housing.<br>
    <strong>Host address: </strong>${body.hostAddress}<br>
    <strong>Host mobile: </strong>${body.hostPhone}</p>

    <p>Lastly, as a reminder, please visit the link to obtain the "Host and Occupant Guidelines" 
    provided by the branch. You are encouraged to review these guidelines to help make the best of the stay: 
      <a href="https://drive.google.com/file/d/1bQAufKzfpXYd68phJYKOJqWgs5iSiXrT/view?usp=sharing">
      Host Occupant Guidelines
      </a>.
    </p>

    <p>It is always worth emphasizing that your loving support of this arrangement is very much appreciated, 
    and your volunteer efforts add to the blessing of this project. May you have Jehovah's blessing!</p>
  `;

    const { data } = await resend.emails.send({
        from: "no-reply@resend.dev",
        to: body.hostEmail,
        subject: "Host Occupant Guidelines",
        html: htmlBody,
    });

    console.log(data)

    return json({ message: 'Email success' }, { status: 200 });
}