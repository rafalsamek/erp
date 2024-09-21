#!/bin/bash

# Function to read values from a YAML file using yq
read_yaml() {
    local file=$1
    local key=$2
    yq e "$key // null" "$file"
}

# Determine the profile and corresponding YAML files
COMMON_YAML="src/main/resources/application.yml"
PROFILE_YAML=""
if [ "$SPRING_PROFILES_ACTIVE" == "dev" ]; then
    PROFILE_YAML="src/main/resources/application-dev.yml"
elif [ "$SPRING_PROFILES_ACTIVE" == "stag" ]; then
    PROFILE_YAML="src/main/resources/application-stag.yml"
elif [ "$SPRING_PROFILES_ACTIVE" == "prod" ]; then
    PROFILE_YAML="src/main/resources/application-prod.yml"
else
    echo "Invalid SPRING_PROFILES_ACTIVE value. Please set it to 'dev', 'stag', or 'prod'."
    exit 1
fi

# Read common configurations
FLYWAY_URL=$(read_yaml $COMMON_YAML '.spring.datasource.url')
FLYWAY_USER=$(read_yaml $COMMON_YAML '.spring.datasource.username')
FLYWAY_PASSWORD=$(read_yaml $COMMON_YAML '.spring.datasource.password')

# Read locations from profile-specific YAML if it exists
if [ -n "$PROFILE_YAML" ]; then
    FLYWAY_LOCATIONS=$(read_yaml $PROFILE_YAML '.spring.flyway.locations' | tr -d '[]' | tr ',' '\n' | xargs | tr ' ' ',')
else
    FLYWAY_LOCATIONS=$(read_yaml $COMMON_YAML '.spring.flyway.locations' | tr -d '[]' | tr ',' '\n' | xargs | tr ' ' ',')
fi

# Generate the flyway.conf file
cat <<EOF > flyway.conf
flyway.url=$FLYWAY_URL
flyway.user=$FLYWAY_USER
flyway.password=$FLYWAY_PASSWORD
flyway.locations=$FLYWAY_LOCATIONS
EOF

echo "Generated flyway.conf with the following content:"
cat flyway.conf
