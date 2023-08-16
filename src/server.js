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
                PUT: "Massive mode send mail",
                POSTFORMATBODY: {
                    authkey: "Use your authorization key",
                    from: "Use one of the authorized senders",
                    to: "To address",
                    cc: "CC address",
                    cco: "CCO address",
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
        logger(`GET /mailer: Status sent {500} \n${error}`)
    }
});

app.post(ENDPOINT, async (req, res) => {
    try {
        if (req.body.authkey === authkey) {
            const result = await mailsend(req.body, false);
            if (result === true) {
                const responseObj = {
                    timestamp: getTimestamp(),
                    status: 200,
                    message: 'Mail succesfully sent'
                };
                logger(`POST /mailer: Email successfully sent {200, ok}`);
                res.status(200).json(responseObj);
            } else {
                const responseObj = {
                    error: 'Nodemailer failed to send mail'
                };
                logger('POST /mailer: Nodemailer failed to send mail');
                res.status(500).json(responseObj);
            }
        } else {
            const responseObj = {
                error: 'Unauthorized request, rejected'
            };
            logger('POST /mailer: Unauthorized request');
            res.status(401).json(responseObj);
        }
    } catch (error) {
        logger(`POST /mailer: Status sent {500} \n${error}`);
        res.status(500).json({ error: 'Internal server error' }); // You can provide a generic error message here
    }


});

app.put(ENDPOINT, async (req, res) => {
    try {
        if (req.body.authkey === authkey) {
            const result = await mailsend(req.body, true);
            if (result === true) {
                const responseObj = {
                    timestamp: getTimestamp(),
                    status: 200,
                    message: 'Massive mode mail package successfully sent'
                };
                logger(`PUT /mailer: Massive mode mail package successfully sent {200, ok}`);
                res.status(200).json(responseObj);
            } else {
                const responseObj = {
                    error: 'Nodemailer failed to send mail'
                };
                logger('PUT /mailer: Nodemailer failed to send mail');
                res.status(500).json(responseObj);
            }
        } else {
            const responseObj = {
                error: 'Unauthorized request, rejected'
            };
            logger('PUT /mailer: Unauthorized request');
            res.status(401).json(responseObj);
        }
    } catch (error) {
        logger(`PUT /mailer: Status sent {500} \n${error}`);
        res.status(500).json({ error: 'Internal server error' }); // You can provide a generic error message here
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
        logger(`OPTIONS /mailer: Status sent {500, error}\n${error}`);
    }
});



app.listen(PORT, () => {
    logger('Server started');
    console.info(`+-----------------------+`);
    console.info(`|   Marcelo Andrés      |`);
    console.info(`|  2023 - Mailer Server |`);
    console.info(`+-----------------------+`);
    console.info(`|  Listening on port    |`);
    console.info(`|                 ${PORT}  |`);
    console.info(`+-----------------------+`);
});