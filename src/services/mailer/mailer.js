const nodemailer = require('nodemailer');
const { pendingWishes } = require('../../../sharedData.js');

require('dotenv').config();

const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

/**
 * Returns a Message header for the mail
 * 
 */
const createMessageHeader = () => ({
        from: 'do_not_reply@northpole.com',
        to: 'santa@northpole.com',
        subject: 'Pending Wishes!',
    });

/**
 * Returns a Message text for the mail
 * 
 */
const createMessageText = () => {
    const strWishes = pendingWishes.map(wish => Object.keys(wish).map(key => ` ${wish[key]}`).join(',')).join('\n');
    return `
    Dear Santa,

        You have following pending wishes to be granted! Hurry!

        ${strWishes}
    `;
}

/**
 * Uses nodemailer sendMail functionality to send message via SMTP
 * 
 */
const invokeSend = (msg) => transporter.sendMail(msg);

/**
 * Mail function that creates message header and body
 * then send it to the Email
 */
const sendMessage = () => {
    try {
        let message = {};
        
        const messageHeader = createMessageHeader();
        const text = createMessageText();

        message = {...messageHeader, text}
        invokeSend(message);
    } catch(e) {
        console.log(e);
    }
}

module.exports = { sendMessage };


