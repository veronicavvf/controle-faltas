const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    family: 4,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },

    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
});

async function sendMail(to, subject, html) {
    try {
        const info = await transporter.sendMail({
            from: `"Suporte" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        })

        return info
    } catch (error) {
        throw error
    }
}

module.exports = {
    transporter,
    sendMail
};
