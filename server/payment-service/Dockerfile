FROM maven:3.9.9-eclipse-temurin-17 AS builder
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn -DskipTests clean package

FROM eclipse-temurin:17-jre
WORKDIR /app

RUN sed -i 's|http://archive.ubuntu.com/ubuntu|https://archive.ubuntu.com/ubuntu|g; s|http://security.ubuntu.com/ubuntu|https://security.ubuntu.com/ubuntu|g' /etc/apt/sources.list.d/ubuntu.sources \
    && apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8083

ENTRYPOINT ["java", "-jar", "app.jar"]
