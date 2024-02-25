const nodemailer = require('nodemailer');

const handler = async (event) => {
  // Check if the request is an OPTIONS preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS, POST' // Add the allowed methods here
      },
      body: ''
    };
  }

  // Handle the POST request as before
  try {
    // Parse form data from the request body
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
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);

    // Respond with success message
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*' // Add CORS headers for the actual request
      },
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    // Respond with error message
    console.error('Error sending email: ', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error sending email' }) };
  }
};

module.exports = { handler };
