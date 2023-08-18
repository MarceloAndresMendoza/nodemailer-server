import * as nodemailer from 'nodemailer';
import { mailerconfig, authkey } from '../config/mailer-config.js';
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
                    logger(`NODEMAILER: ${error}`);
                    reject(false);
                } else {
                    logger("NODEMAILER: Succesfully verified");
                    resolve(true);
                }
            });
        });
        return true; // Return true on success
    } catch (error) {
        logger(`An error ocurred: ${error}`);
        return false; // Return false on error
    }
};

export const mailsend = async (data, massivemode) => {
    const { from, to, cc, cco, subject, replyto, body, text } = data;
    const sentEmails = [];
    const failedEmails = [];

    if (authkey == data.authkey) {
        const retryAttempts = 3;
        const retryTimeout = 3000; // 3 seconds

        if (massivemode) {
            logger(`PUT /mailer: MASSIVE MODE ENGAGED`);

            const allRecipients = `${to};${cc};${cco}`; // Combine all recipients into one string

            const recipientsArray = allRecipients.split(';').map(email => email.trim()); // Split and trim emails

            const batchSize = 25; // Set the batch size as needed

            for (let batchNumber = 0; batchNumber < recipientsArray.length; batchNumber += batchSize) {
                const batchRecipients = recipientsArray.slice(batchNumber, batchNumber + batchSize);
                const batchTo = batchRecipients.filter(email => to.includes(email)).join(';');
                const batchCc = batchRecipients.filter(email => cc.includes(email)).join(';');
                const batchCco = batchRecipients.filter(email => cco.includes(email)).join(';');

                for (let retry = 1; retry <= retryAttempts; retry++) {
                    try {
                        const info = await transporter.sendMail({
                            from: from,
                            to: batchTo,
                            cc: batchCc,
                            bcc: batchCco,
                            subject: subject,
                            text: text,
                            replyTo: replyto,
                            html: body
                        });

                        sentEmails.push(...batchRecipients);
                        logger(`Batch ${batchNumber / batchSize + 1} / ${Math.ceil(recipientsArray.length / batchSize)} sent (${batchRecipients.length} recipients/${batchSize} max)`);
                        break; // Break the retry loop on success
                    } catch (error) {
                        failedEmails.push(...batchRecipients);
                        logger(`Batch ${batchNumber / batchSize + 1} / ${Math.ceil(recipientsArray.length / batchSize)} failed (Attempt ${retry}): ${batchRecipients.length} recipients`);

                        if (retry < retryAttempts) {
                            await new Promise(resolve => setTimeout(resolve, retryTimeout)); // Wait before retrying
                        }
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before the next batch
            }
            logger(`Sent emails: ${sentEmails.join('; ')}`);
            logger(`Failed emails: ${failedEmails.join('; ')}`);

            if (sentEmails.length > 0) { logger(`Mail sent : ${sentEmails.length} emails`); }
            if (failedEmails.length > 0) { logger(`Mail failed : ${failedEmails.length} emails`); }

            return true; // Return true after all batches have been processed
        } else {
            try {
                const info = await transporter.sendMail({
                    from: from,
                    to: to,
                    cc: cc,
                    bcc: cco,
                    subject: subject,
                    text: text,
                    replyTo: replyto,
                    html: body
                });

                sentEmails.push(to, cc, cco); // Add successful emails to array
                logger(`Mail sent!:  ${sentEmails}`);

                return true;
            } catch (error) {
                failedEmails.push(to, cc, cco); // Add failed emails to array
                logger(`Mail failed!: ${failedEmails}`);
                logger(`Error description: ${error}`);

                return false; // Return false on error
            }
        }
    } else {
        logger(`Unauthorized request, check your authkey!`);
        return false
    }
};

