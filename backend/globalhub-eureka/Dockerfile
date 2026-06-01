# NiaHubX Eureka Service Discovery Dockerfile

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the JAR file
COPY target/*.jar app.jar

# Expose Eureka port
EXPOSE 8761

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8761/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]

# JVM options for container
ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"
CMD ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
