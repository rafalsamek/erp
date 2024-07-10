# Use Gradle with OpenJDK 17 for both build and runtime
FROM gradle:7.4.2-jdk17

# Set the working directory
WORKDIR /app

# Install necessary tools
RUN apt-get update && apt-get install -y findutils curl unzip mysql-client wget \
    && wget https://github.com/mikefarah/yq/releases/download/v4.16.1/yq_linux_amd64 -O /usr/local/bin/yq \
    && chmod +x /usr/local/bin/yq

# Set environment variables for Flyway
ENV FLYWAY_VERSION 10.15.2
ENV FLYWAY_HOME /flyway

# Download and install Flyway CLI
RUN curl -L "https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/${FLYWAY_VERSION}/flyway-commandline-${FLYWAY_VERSION}-linux-x64.tar.gz" -o flyway.tar.gz \
    && tar -xzf flyway.tar.gz \
    && mv flyway-${FLYWAY_VERSION} ${FLYWAY_HOME} \
    && ln -s ${FLYWAY_HOME}/flyway /usr/local/bin \
    && rm flyway.tar.gz

# Copy the Gradle wrapper and other necessary files first to leverage Docker cache
COPY gradlew gradlew
COPY gradle gradle
COPY build.gradle settings.gradle ./

# Ensure gradlew is executable
RUN chmod +x gradlew

# Copy the source code
COPY src ./src

# Copy the shell scripts
COPY wait-for-mysql.sh wait-for-mysql.sh
COPY generate-my-cnf.sh generate-my-cnf.sh
COPY generate-flyway-conf.sh generate-flyway-conf.sh

# Ensure the scripts are executable
RUN chmod +x wait-for-mysql.sh generate-my-cnf.sh generate-flyway-conf.sh

# Clean and build the project (without running tests)
RUN ./gradlew clean build -x test --no-daemon --stacktrace --info

# Expose the application port
EXPOSE 8080

# Set the entry point to wait for MySQL to be ready before starting the application
ENTRYPOINT ["./wait-for-mysql.sh", "java", "-jar", "/app/build/libs/backend-0.0.1-SNAPSHOT.jar"]
