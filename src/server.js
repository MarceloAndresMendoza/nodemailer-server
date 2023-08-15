import express from 'express';
import { getTimestamp } from './utils/utils.js';
import { logger } from './utils/logger.js';
import { mailsend, testnodemailer } from './utils/mailer.js';
import { authkey } from './config/mailer-config.js';

const ENDPOINT = '/mailer';
const PORT = 4200
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get(ENDPOINT, async (req, res) => {
    try {
        res.status(200).json({
            timestamp: getTimestamp(),
            status: 200,
            message: 'Server working normally',
            commands: {
                GET: "Check server status, this method",
                OPTIONS: "Verify nodemailer connection and credentials",
                POST: "Send mail",
                POSTFORMATBODY: {
                    authkey: "Use your authorization key",
                    from: "Use one of the authorized senders",
                    to: "To address",
                    subject: "The subject",
                    replyto: "Reply-to address",
                    body: "Content of the message, use html",
                    text: "Content of the message, use plain text"
                }
            }
        })
        logger('GET /mailer: Server status sent: {200}')
    } catch (error) {
        res.status(500).json({ error: error });
        console.log(getTimestamp(), 'Error:', error)
        logger(`GET /mailer: Status sent {500} \n${error}`)
    }
});

app.post(ENDPOINT, async (req, res) => {
    try {
        const result = await mailsend(req.body);
        if (req.body.authkey === authkey) {
            if (result === true) {
                res.status(200).json({
                    timestamp: getTimestamp(),
                    status: 200,
                    message: 'Mail succesfully sent'
                });
                const sanitizedBody = { ...req.body, authkey: 'authorized' };
                logger(`POST /mailer: Email successfully sent {200, ok}\n${JSON.stringify(sanitizedBody)}`);
            } else {
                res.status(500).json({
                    error: 'Nodemailer failed to send mail'
                });
                console.log(getTimestamp(), 'Error:', 'Nodemailer failed to send mail');
                logger('POST /mailer: Nodemailer failed to send mail');
            }
        } else {
            res.status(401).json({
                error: 'Unauthorized request, rejected'
            });
            console.log(getTimestamp(), 'Error:', 'Unauthorized request');
            logger('POST /mailer: Unauthorized request');
        }
    } catch (error) {
        res.status(500).json({ error: error });
        console.log(getTimestamp(), 'Error:', error)
        logger(`POST /mailer: Status sent {500} \n${error}`)
    }
});

app.options(ENDPOINT, async (req, res) => {
    logger('OPTIONS /mailer: Verify request recieved...');
    try {
        const result = await testnodemailer(); // Await the async function

        if (result === true) {
            res.status(200).json({
                timestamp: getTimestamp(),
                status: 200,
                message: 'Nodemailer successfully verified'
            });
            logger('OPTIONS /mailer: NodeMailer verified successfully {200, ok}');
        } else {
            res.status(500).json({
                error: 'Nodemailer failed to verify status'
            });
            console.log(getTimestamp(), 'Error:', 'Nodemailer failed to verify status');
            logger('OPTIONS /mailer: Nodemailer failed to verify status');
        }
    } catch (error) {
        res.status(500).json({ error: error.message }); // Use error.message
        console.log(getTimestamp(), 'Error:', error);
        logger(`OPTIONS /mailer: Status sent {500, error}\n${error}`);
    }
});



app.listen(PORT, () => {
    // logger('Server started');
    console.info(`+-----------------------+`);
    console.info(`|   Marcelo Andrés      |`);
    console.info(`|  2023 - Mailer Server |`);
    console.info(`+-----------------------+`);
    console.info(`|  Listening on port    |`);
    console.info(`|                 ${PORT}  |`);
    console.info(`+-----------------------+`);
});