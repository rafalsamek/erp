#!/bin/sh
certbot certonly --webroot --webroot-path=/var/www/certbot \
  --email ewa4852@gmail.com --agree-tos --no-eff-email \
  -d erp.smartvizz.com
