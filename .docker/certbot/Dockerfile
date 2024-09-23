# Use the Certbot base image
FROM certbot/certbot

# Copy the existing initialization script into the container
COPY ./.docker/certbot/init-certbot.sh /usr/local/bin/init-certbot.sh

# Make the script executable
RUN chmod +x /usr/local/bin/init-certbot.sh

# Use the custom script for the default command to initialize and renew certificates
CMD ["/usr/local/bin/init-certbot.sh"]
