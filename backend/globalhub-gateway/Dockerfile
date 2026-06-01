# NiaHubX API Gateway Dockerfile

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the JAR file
COPY target/*.jar app.jar

# Expose gateway port
EXPOSE 9096

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:9096/actuator/health || exit 1

# JVM options for container
ENV JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Run the application
CMD ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
