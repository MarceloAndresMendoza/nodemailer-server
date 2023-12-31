import express from 'express';
import cors from 'cors';
import { getTimestamp } from './utils/utils.js';
import { logger } from './utils/logger.js';
import { mailsend, testnodemailer } from './utils/mailer.js';
import { authkey } from './config/mailer-config.js';

const corsOptions={
    origin:[
        'http://localhost:3000',
        'https://doblefoco.cl'
    ],
    optionsSucessStatus: 200
}

const ENDPOINT = '/mailer';
const PORT = 4200
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.get(ENDPOINT, async (req, res) => {
    try {
        const serverCheck = await testnodemailer()
        const serverCheckStatus = serverCheck ? 'pass' : 'fail';
        res.status(200).json({
            timestamp: getTimestamp(),
            status: 200,
            message: 'Server working normally',
            nodeMailerCheck: serverCheckStatus,
            commands: {
                GET: "Check server status, this method",
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

app.listen(PORT, () => {
    const version = '0.1.1'
    logger(`Server started: ${version}`);
    console.info(`+-----------------------+`);
    console.info(`|   Marcelo Andrés      |`);
    console.info(`|  2023 - Mailer Server |`);
    console.info(`|    - Version ${version}    |`);
    console.info(`+-----------------------+`);
    console.info(`|  Listening on port    |`);
    console.info(`|                 ${PORT}  |`);
    console.info(`+-----------------------+`);
});