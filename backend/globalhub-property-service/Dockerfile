# GlobalHub Property Service Dockerfile

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy the JAR file
COPY target/*.jar app.jar

# Create uploads directory structure with proper permissions
RUN mkdir -p /app/uploads/properties /app/uploads/vendors && \
    chmod -R 777 /app/uploads

# Create a non-root user for running the application
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose property service port
EXPOSE 7086

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:7086/actuator/health || exit 1

# JVM options for container
ENV JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Run the application
CMD ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
