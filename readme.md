# API-NodeMailer Installation Script

This script automates the installation of the API-NodeMailer program. It performs the following steps:

1. Copies your app files to the specified target directory.
2. Installs your app's dependencies (if needed).
3. Configures the API-NodeMailer server.
4. Creates a systemd service to manage the API-NodeMailer process.

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