export function htmlBody(body: any) {
    return `
    <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8" />
            </head>

            <body style="
            margin:0;
            padding:40px 0;
            background:#ffffff;
            font-family:Arial, Helvetica, sans-serif;
            color:#222;
            line-height:1.45;"
            >

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                        <td align="center">

                            <table role="presentation"
                            width="700"
                            cellspacing="0"
                            cellpadding="0"
                            style="max-width:700px;">

                                <tr>
                                    <td style="font-size:16px;">

                                        <p style="margin:0 0 32px;">
                                        Dear friends,
                                        </p>

                                        <p style="margin:0 0 36px;">
                                        By way of introduction, included in this email is
                                        <strong>${body.name}</strong>
                                        who will be visiting from
                                        <strong>${body.date_start}</strong>
                                        to
                                        <strong>${body.date_end}</strong>
                                        to assist with the
                                        <strong>${body.projectName}</strong>
                                        project.
                                        </p>

                                        <div style="margin-left:64px; margin-bottom:34px;">
                                            <div style="
                                                font-weight:bold;
                                                text-decoration:underline;
                                                font-size:18px;
                                                margin-bottom:10px;">
                                                Guest information
                                            </div>

                                            <div>Name: ${body.name}</div>
                                            <div>Mobile: ${body.phone}</div>
                                        </div>

                                        <p style="margin:0 0 34px;">
                                        Also included in this email is the host
                                        <strong>${body.hostName}</strong>,
                                        who will be providing housing.
                                        </p>

                                        <div style="margin-left:64px; margin-bottom:38px;">
                                            <div style="
                                                font-weight:bold;
                                                text-decoration:underline;
                                                font-size:18px;
                                                margin-bottom:10px;">
                                                Host information
                                            </div>

                                            <div>Name: ${body.hostName}</div>
                                            <div>Address: ${body.hostAddress}</div>
                                            <div>Mobile: ${body.hostPhone}</div>
                                        </div>

                                        <p style="margin:0 0 52px;">
                                        We want to warmly express our appreciation for your loving support of this arrangement.
                                        May you have Jehovah's blessing!
                                        </p>

                                        <h1 style="
                                            margin:0;
                                            font-size:28px;
                                            font-weight:400;
                                        ">
                                        Helpful Information
                                        </h1>

                                        <hr style="
                                            border:none;
                                            border-top:1px solid #888;
                                            margin:16px 0 20px;
                                        ">

                                        <p style="margin:0 0 36px;">
                                        You are encouraged to review
                                        <i>Host and Occupant Guidelines</i>,
                                        provided by the U.S. branch, to help you make the best of your stay:
                                        <br><br>

                                            <a href="https://drive.google.com/file/d/1mfO3HSsR9Vbd9J12AzM6rXnD4X3DkIwC/view?usp=drive_link"
                                            style="color:#0066cc;">
                                            Host and Occupant Guidelines
                                            </a>
                                        </p>

                                        <p style="margin:0;">
                                        <strong>Your brothers,</strong><br>

                                        <span style="
                                            color:#D88720;
                                            font-weight:bold;
                                            font-size:16px;">
                                        Local Design/Construction Department
                                        </span>
                                        <br>

                                        <span style="font-size:16px;">
                                        <strong>5.07</strong> | Housing
                                        </span>
                                        </p>

                                    </td>
                                </tr>

                            </table>

                        </td>
                    </tr>
                </table>

            </body>
        </html>
    `;
};