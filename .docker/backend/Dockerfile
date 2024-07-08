# Use Gradle with OpenJDK 17 for both build and runtime
FROM gradle:8.8-jdk17

# Set the working directory
WORKDIR /app

# Install necessary tools
RUN apt-get update && apt-get install -y findutils

# Copy the Gradle wrapper and other necessary files first to leverage Docker cache
COPY gradlew gradlew
COPY gradle gradle
COPY build.gradle settings.gradle ./

# Ensure gradlew is executable
RUN chmod +x gradlew

# Copy the source code
COPY src ./src

# Clean and build the project (without running tests) as the root user
RUN ./gradlew clean build --no-daemon --stacktrace --info

# Expose the application port
EXPOSE 8080

# Set the entry point to run the jar file
ENTRYPOINT ["java", "-jar", "/app/build/libs/backend-0.0.1-SNAPSHOT.jar"]
