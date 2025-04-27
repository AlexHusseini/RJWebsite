const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configure email transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',  // Replace with your email
    pass: 'your-app-password'      // Replace with your app password
  }
});

exports.sendContactEmail = functions.https.onCall(async (data, context) => {
  try {
    const { name, email, subject, message } = data;
    
    // Email content
    const mailOptions = {
      from: 'Website Contact Form <noreply@photography-website.com>',
      to: 'rj.shaheen03@gmail.com',  // Email where you want to receive messages
      replyTo: email,
      subject: `Website Contact: ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        
        Message:
        ${message}
      `,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
});