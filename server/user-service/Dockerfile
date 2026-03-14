# Build Stage
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Run Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
# NOTE: Check your User Service's application.properties for its port. 
# I am assuming 8081 here, but change it if your group member used a different port!
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]