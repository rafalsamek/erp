#!/bin/sh

# Generate the certificate if it doesn't exist
if [ ! -f "/etc/letsencrypt/live/erp.smartvizz.com/fullchain.pem" ]; then
  certbot certonly --webroot --webroot-path=/var/www/certbot \
    --email ewa4852@gmail.com --agree-tos --no-eff-email \
    -d erp.smartvizz.com
fi

# Start a loop to renew the certificate every 12 hours
while :; do
  certbot renew
  sleep 12h
done
