#!/bin/bash
echo "Quick updating remaining services..."

# Update Gateway
cat > globalhub-gateway/src/main/resources/application.yml << YML
server:
  port:9096
spring:
  application:
  name: api-gateway
eureka:
  client:
  service-url:
      defaultZone: http://localhost:9095/eureka/
YML
echo "✓ Gateway updated (9096)"

# Update User Service  
cat > globalhub-user-service/src/main/resources/application.yml << YML
server:
  port:9098
spring:
  application:
  name: user-service
  datasource:
  url: jdbc:mysql://localhost:3306/globalhub_users?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: root
    password: Password@224
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
   hibernate:
      ddl-auto: update
   properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
eureka:
  client:
  service-url:
      defaultZone: http://localhost:9095/eureka/
springdoc:
  swagger-ui:
    path: /swagger-ui.html
    enabled: true
YML
echo "✓ User Service updated (9098)"

echo "Done!"
