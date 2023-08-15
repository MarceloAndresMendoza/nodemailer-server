# API-NodeMailer

API-NodeMailer is a simple Node.js application that provides a simple API for sending emails using the Nodemailer library. This application allows you to quickly set up a server to send emails from your Node.js application, whether it's for transactional notifications, newsletters, or any other email communication needs.

### Important Notes and Disclaimer
While efforts have been made to ensure its functionality, it might not represent the best or most comprehensive implementation.

By using and implementing API-NodeMailer, you acknowledge and accept that it is provided "as-is," and no warranties or guarantees of any kind are provided regarding its functionality, reliability, or suitability for any purpose.

You are solely responsible for ensuring that API-NodeMailer meets your requirements and for the appropriate use and implementation of the application. Use API-NodeMailer responsibly and ensure you understand the actions it performs.

## Download this software
```bash
git clone https://github.com/MarceloAndresMendoza/nodemailer-server
```

## Requirements

### SMTP Server

API-NodeMailer requires a functioning SMTP server to send emails. An SMTP server is responsible for sending outgoing emails to their intended recipients. You have a few options for obtaining an SMTP server:

1. **Self-Hosted SMTP Server:** You can set up your own SMTP server using software such as Postfix, Exim, or Microsoft Exchange. Self-hosted servers offer full control and customization.

2. **Third-Party SMTP Services:** There are several third-party SMTP services that you can use, some of which offer free plans with limited sending capabilities. Here are a few popular options:

   - [SendinBlue](https://app.sendinblue.com/account/register): Offers a free plan with a limited number of daily emails.
   - [Mailgun](https://www.mailgun.com/): Provides a free tier with a certain number of monthly emails.
   - [SendGrid](https://sendgrid.com/): Offers a free tier with a limited number of emails per day.

You can even use your gmail account or another wich supports SMTP mail transfer protocol.

**Ensure that you have access to the SMTP server's host, port, secure connection settings, and authentication credentials (username and password) before proceeding with API-NodeMailer installation.**

### Environment

API-NodeMailer is designed to run on a Node.js environment. Ensure that you have the following components installed:

- [Node.js](https://nodejs.org/): API-NodeMailer requires Node.js to execute its server-side JavaScript code.

Also, it comes with a handy script that installs this program as a service. Please refer to the install section. 

## Ports

Remember to open appropiate porst before using (even installing) this software. 
- Port 443: for cloning this repo via https
- Port 465: TLS encryption for mail server (or another if using SSL)
- Port 4200: The default port of this program's API

Check your firewall options if you are using UFW:
```bash
sudo ufw status
```
and your server's port forwarding options.

## Usage

API-NodeMailer provides a RESTful API for sending emails. Refer to the API endpoints documented in the [server code](src/server.js) for details on how to interact with the API and send emails.

# API-NodeMailer Installation Script: 
**install.sh**

This script automates the installation of the API-NodeMailer program. It performs the following steps:

1. Copies your app files to the specified target directory.
2. Installs your app's dependencies (if needed).
3. Configures the API-NodeMailer server.
4. Creates a systemd service to manage the API-NodeMailer process.

## Requirements

### Operating System

API-NodeMailer is designed to run on Unix-like operating systems, including Linux distributions and macOS. While it may work on other systems, it's primarily tested and intended for use on these platforms.

### User with Sudo Capability

To install and manage system services, you need administrative privileges. You should have a user account with sudo capability. This allows you to run commands with elevated privileges to install the service files, reload the systemd daemon, and manage the service.

## Usage

### Making the Script Executable

Before running the script, you need to make it executable:

```bash
chmod +x install.sh
```

### Running the Script
To run the installation script, execute the following command:

```bash
sudo ./install-api-nodemailer.sh
```
The script will guide you through the configuration process for the API-NodeMailer program. Make sure to provide the requested information accurately.

Once the script completes successfully, the API-NodeMailer program will be installed, configured, and running as a systemd service.

# Managing the Service
To stop the service, use the following command:

```bash
sudo systemctl stop api-nodemailer
```

To disable the service (prevent it from starting on boot):

```bash
sudo systemctl disable api-nodemailer
```

## Uninstallation
If you need to uninstall the API-NodeMailer program, follow these steps:

Stop the service and disable it:

```bash
sudo systemctl stop api-nodemailer
sudo systemctl disable api-nodemailer
```

Delete the installation folder:

```bash
sudo rm -rf /opt/api-nodemailer
```

Delete the service file, be careful since you can accidentally delete another file, this step is optional while you keep the service disabled.

```bash
sudo rm /etc/systemd/system/api-nodemailer.service
```


# Important Notes

Review the generated configuration file (src/config/mailer-config.js) to ensure the accuracy of the provided information.

After successful installation, the script recommends deleting the installation folder. Make sure you have verified the successful operation of the API-NodeMailer program before doing so.

If you encounter any issues during installation, review the script steps, check for error messages, and review the status of the systemd service.

Please use this script responsibly and ensure that you have the necessary permissions and understanding of the actions it performs.

Note: This script is provided as-is and does not guarantee a flawless installation in all environments. Review, customize, and test the script based on your specific requirements.