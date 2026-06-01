# NiaHubX Auth Service Dockerfile

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the JAR file
COPY target/*.jar app.jar

# Expose auth service port
EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8081/actuator/health || exit 1

# JVM options for container
ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Run the application
CMD ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
