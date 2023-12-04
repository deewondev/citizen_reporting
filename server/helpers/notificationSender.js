const Subscription = require('../model/Subscription');
const nodemailer = require('nodemailer');
const htmlContent = require('../helpers/emailContent');

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASSWORD
    }
});

// Function to send emails
const sendEmail = async(to_email, htmlContent) => {
    const mailOptions = {
        from: process.env.APP_EMAIL,
        to: to_email,
        subject: process.env.APP_TITLE,
        html: htmlContent
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent to:', to_email);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Function to fetch email addresses and send notifications
const sendNotificationsToSubscribers = async () => {
    try {
        // Fetch email addresses
        const subscriptions = await Subscription.find({}, 'email');

        subscriptions.forEach(async(sub) => {
            const emailContent = htmlContent();
            await sendEmail(sub.email, emailContent);
        });
    } catch (error) {
        console.error('Error:', error);
    }
};

module.exports = sendNotificationsToSubscribers;
