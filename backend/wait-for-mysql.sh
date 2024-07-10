#!/bin/bash

# Generate the .my.cnf file
./generate-my-cnf.sh

cmd="$@"

echo "Waiting for MySQL at $MYSQL_HOST:$MYSQL_PORT..."

until mysql --defaults-extra-file=/root/.my.cnf -e 'SHOW DATABASES'; do
  >&2 echo "MySQL is unavailable - sleeping"
  sleep 1
done

>&2 echo "MySQL is up - executing command"
exec $cmd
