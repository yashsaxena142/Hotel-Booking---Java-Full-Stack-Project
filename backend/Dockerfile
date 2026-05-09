# Build stage
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app

# Copy pom.xml first
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the jar
COPY --from=build /app/target/*.jar app.jar

# Create a startup script with debugging
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "=========================================="' >> /app/start.sh && \
    echo 'echo "Starting Hotel Booking Backend"' >> /app/start.sh && \
    echo 'echo "=========================================="' >> /app/start.sh && \
    echo 'echo "Active Profile: $SPRING_PROFILES_ACTIVE"' >> /app/start.sh && \
    echo 'echo "Database URL: $DATABASE_URL"' >> /app/start.sh && \
    echo 'echo "Database Username: $DATABASE_USERNAME"' >> /app/start.sh && \
    echo 'echo "=========================================="' >> /app/start.sh && \
    echo 'exec java -jar app.jar' >> /app/start.sh && \
    chmod +x /app/start.sh

EXPOSE 8080
CMD ["/app/start.sh"]