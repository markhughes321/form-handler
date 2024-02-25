const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  const { name, email, message } = JSON.parse(event.body);

  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Setup email data
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: process.env.TO_EMAIL,
    subject: 'New Form Submission',
    text: `
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `
  };

  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);
    return {
      statusCode: 200,
      body: 'Email sent successfully'
    };
  } catch (error) {
    console.error('Error sending email: ', error);
    return {
      statusCode: 500,
      body: 'Error sending email'
    };
  }
};
