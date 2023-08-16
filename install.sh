#!/bin/bash
echo "This script will install the API-NodeMailer program."

# Specify the source directory of your Node.js app
SOURCE_DIR="./"

# Specify the target directory where your app will be copied and run
TARGET_DIR="/opt/api-nodemailer"

# Get node path on PATH env
NODE_PATH=$(which node | grep 'node')

# Get the current username
CURRENT_USER=$(whoami)
CURRENT_GROUP=$(id -gn)

# Check if the configuration file exists
if [ -f "$TARGET_DIR/src/config/mailer-config.js" ]; then
    # Update the program
    echo "Program already installed, updating..."
    # Copy your app files to the target directory
    echo "Copying files..."
    sudo cp -r "$SOURCE_DIR"/* "$TARGET_DIR/"
    # Navigate to the target directory
    cd "$TARGET_DIR"
    sudo chown -R $CURRENT_USER:$CURRENT_GROUP .

    # Install your app's dependencies (if needed)
    echo "Installing dependencies..."
    npm install
    # Restart the service
    echo "Restarting the service..."
    sudo systemctl restart api-nodemailer
    echo "Update finished."
else
    # Copy your app files to the target directory
    echo "Copying files..."
    sudo mkdir -p "$TARGET_DIR"
    sudo cp -r "$SOURCE_DIR"/* "$TARGET_DIR/"
    # Navigate to the target directory
    cd "$TARGET_DIR"
    sudo chown -R $CURRENT_USER:$CURRENT_GROUP .

    # Install your app's dependencies (if needed)
    echo "Installing dependencies..."
    npm install
    # Configure the server
    echo "API NODEMAILER CONFIGURATION"
    echo "Please, take your time to configure properly these options."
    echo "==========================================================="

    # Prompt for configuration values
    read -p "Enter mail server host: " host
    read -p "Enter mail server port (e.g., 465): " port
    read -p "Does the server require secure connection (true/false): " secure
    read -p "Enter your email user: " user
    read -p "Enter your email password: " pass
    read -p "Enter frontend authentication key (any you want): " authkey

    # Generate the configuration file
    cat << EOF > src/config/mailer-config.js
    // Configuration file generated on install.

    export const mailerconfig = {
        host: '$host',
        port: $port,
        secure: $secure,
        auth: {
            user: '$user',
            pass: '$pass'
        }
    }

    export const authkey = '$authkey'
EOF

    # Create a systemd service file
    echo "Creating system service..."
    echo "[Unit]
Description=APINodeMailer

[Service]
ExecStart=$NODE_PATH $TARGET_DIR/src/server.js
Restart=always
User=$CURRENT_USER
Environment=NODE_ENV=production
WorkingDirectory=$TARGET_DIR

[Install]
WantedBy=multi-user.target" > api-nodemailer.service

    # Copy the service file to systemd directory
    sudo cp api-nodemailer.service /etc/systemd/system/

    # Reload systemd
    sudo systemctl daemon-reload

    # Enable and start the service
    sudo systemctl enable api-nodemailer
    sudo systemctl start api-nodemailer

    echo "==========================================================="
    sudo systemctl status api-nodemailer
fi

echo "==========================================================="
echo Finished! Check the above result of the system service, should not fail.
echo If failed, review the steps on installation or check installed files.
echo "==========================================================="
echo If everything is ok, you can safely delete this folder.
echo - Installation location: $TARGET_DIR
echo - To stop the service: systemctl stop api-nodemailer
echo - To disable the service: systemctl disable api-nodemailer
echo "==========================================================="
