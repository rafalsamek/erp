# Use the Certbot base image
FROM certbot/certbot

# Create a script to run the Certbot command
RUN echo '#!/bin/bash\n\
certbot certonly --webroot --webroot-path=/var/www/certbot \\\n\
  --email ewa4852@gmail.com --agree-tos --no-eff-email \\\n\
  -d erp.smartvizz.com' > /usr/local/bin/init-certbot.sh

# Make the script executable
RUN chmod +x /usr/local/bin/init-certbot.sh

# The default command that will be used to renew certificates
CMD ["/bin/sh", "-c", "trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;"]
