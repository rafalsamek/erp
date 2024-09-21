FROM phpmyadmin/phpmyadmin

# Set a default value (will be overwritten during build if passed)
ARG PMA_ABSOLUTE_URI

RUN echo "\$cfg['PmaAbsoluteUri'] = '${PMA_ABSOLUTE_URI}';" >> /etc/phpmyadmin/config.inc.php
