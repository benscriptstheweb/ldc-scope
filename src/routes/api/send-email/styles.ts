function formatPhone(phone: number): string {
    const digits = phone.toString();

    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

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

                                        <p style="margin:0 0 32px;">
                                        This email serves as an introduction between
                                        <strong>${body.name}</strong> (${formatPhone(body.phone)}),
                                        who will be visiting on
                                        <strong>${body.date_start}</strong> –
                                        <strong>${body.date_end}</strong>
                                        to assist with the
                                        <strong>${body.projectName}</strong> project.
                                        Also included in this email is
                                        <strong>${body.hostName}</strong> (${formatPhone(body.hostPhone)}),
                                        who will be providing the housing accommodations.
                                        </p>

                                        <p style="margin:0 0 16px;">
                                        Below is the address of the host's property:
                                        </p>

                                        <div style="
                                            margin-left:48px;
                                            margin-bottom:36px;
                                            font-size:16px;">
                                            ${body.hostAddress}
                                        </div>

                                        <p style="margin:0 0 40px;">
                                        We recommend that you contact one another to review any further details,
                                        such as expected time of arrival, special remarks, or any other information
                                        that will help make the stay enjoyable for everyone.
                                        </p>

                                        <p style="margin:0 0 52px;">
                                        Your volunteer efforts for this arrangement add to the blessing of this
                                        project, and your families' loving support is much appreciated.
                                        Thank you very much!
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
                                        provided by the U.S. branch, to help make the best of your stay:
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