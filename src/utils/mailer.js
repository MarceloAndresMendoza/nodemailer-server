import * as nodemailer from 'nodemailer';
import { mailerconfig , authkey } from '../config/mailer-config.js';
import { logger } from './logger.js';

const transporter = nodemailer.createTransport(
    mailerconfig
);

export const testnodemailer = async () => {
    console.log("OPTIONS /mailer: Got nodemailer connection request...");
    try {
        await new Promise((resolve, reject) => {
            transporter.verify((error, success) => {
                if (error) {
                    console.error("NODEMAILER:", error);
                    reject(false);
                } else {
                    console.log("NODEMAILER: Succesfully verified");
                    resolve(true);
                }
            });
        });
        return true; // Return true on success
    } catch (error) {
        console.error("An error occurred:", error);
        return false; // Return false on error
    }
};

export const mailsend = async (data) => {
    const { authkey, from, to, subject, replyto, body, text} = data;
    try {
        const info = await transporter.sendMail({
            from: data.from,
            to: data.to,
            subject: data.subject,
            text: data.body,
            replyTo: data.replyto,
            text: data.text,
            html: data.body
        })
        return true;
    } catch (error) {
        console.error("An error occurred:", error);
        return false; // Return false on error
    }
}