import * as fs from 'fs';
import { getTimestamp } from './utils.js';
const LOGFILENAME = './src/logs/server.log';
const ENCODING = 'utf-8';

export const logger = (message) => {
    const logMessage = `[${getTimestamp()}] ${message}`;

    return new Promise((resolve, reject) => {
        fs.appendFile(LOGFILENAME, `${logMessage}\n`, ENCODING, (err) => {
            if (err) {
                reject('Error writing to log file');
                console.error('Error writing to log file:', err);
                return;
            }
            console.log(logMessage);
            resolve('Log saved');
        });
    })
}