# Build stage
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /order-service ./cmd/server

# Run stage
FROM alpine:latest
WORKDIR /
# Create the nonroot user and group
RUN addgroup -S nonroot && adduser -S nonroot -G nonroot
COPY --from=builder /order-service /order-service
EXPOSE 8080
# Switch to the new user
USER nonroot:nonroot
ENTRYPOINT ["/order-service"]