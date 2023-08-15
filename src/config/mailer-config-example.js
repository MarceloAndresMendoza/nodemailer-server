// Configuration file. 
// Fill the data and rename this file to mailer-config.js.

export const mailerconfig = {
    host: 'your_server',
    port: 465, // 465: TLS
    secure: true, // True if requires authentication
    auth: {
        user: 'Your_user_here',
        pass: 'Your_password_here'
    }
}

export const authkey = 'Any_auth_key_you_want_to_log_from_frontend'