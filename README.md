# MiniEcommerce

Microservice-based e-commerce project with:

- `user-service` (Spring Boot, port `8081`)
- `payment-service` (Spring Boot, port `8083`)
- `client` (React + Vite, served by Nginx, exposed on `5173` for local Docker)

This repository now includes a complete Docker and Kubernetes setup.

## Project Layout

- `docker-compose.yml` - Run all services with Docker Compose
- `user-service/Dockerfile` - Image build for user-service
- `payment-service/Dockerfile` - Image build for payment-service
- `client/Dockerfile` - Multi-stage build for frontend (Node build + Nginx runtime)
- `client/nginx/default.conf` - SPA routing + reverse proxy to backend APIs
- `k8s/` - Kubernetes namespace, deployments, services, ingress

## 1. Run with Docker Compose

### Prerequisites

- Docker Desktop installed and running

### Start all services

From repository root:

```bash
docker compose up --build
```

### Access

- Frontend: `http://localhost:5173`
- User service Swagger: `http://localhost:8081/swagger-ui.html`
- Payment service Swagger: `http://localhost:8083/swagger-ui.html`

### Stop

```bash
docker compose down
```

## 2. Run with Kubernetes

### Prerequisites

- A local Kubernetes cluster (Minikube or Docker Desktop Kubernetes)
- `kubectl` installed
- NGINX Ingress controller (only needed if using `k8s/ingress.yaml`)

### Build images for local cluster

Use image names expected by manifests:

- `mini-ecommerce/user-service:latest`
- `mini-ecommerce/payment-service:latest`
- `mini-ecommerce/client:latest`

Example with local Docker daemon:

```bash
docker build -t mini-ecommerce/user-service:latest ./user-service
docker build -t mini-ecommerce/payment-service:latest ./payment-service
docker build -t mini-ecommerce/client:latest ./client
```

If using Minikube, build into Minikube Docker daemon:

```bash
minikube image build -t mini-ecommerce/user-service:latest ./user-service
minikube image build -t mini-ecommerce/payment-service:latest ./payment-service
minikube image build -t mini-ecommerce/client:latest ./client
```

### Deploy

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/user-service.yaml
kubectl apply -f k8s/payment-service.yaml
kubectl apply -f k8s/client.yaml
kubectl apply -f k8s/ingress.yaml
```

### Verify

```bash
kubectl get pods -n mini-ecommerce
kubectl get svc -n mini-ecommerce
kubectl get ingress -n mini-ecommerce
```

### Access options

1. Using Ingress (`mini-ecommerce.local`):

- Add to hosts file:
	- `127.0.0.1 mini-ecommerce.local`
- Open: `http://mini-ecommerce.local`

2. Using port-forward without Ingress:

```bash
kubectl port-forward -n mini-ecommerce svc/client 5173:80
```

Then open `http://localhost:5173`.

### Remove deployment

```bash
kubectl delete namespace mini-ecommerce
```

## Notes

- `payment-service` automatically calls `user-service` using internal DNS:
	- Docker Compose: `http://user-service:8081`
	- Kubernetes: `http://user-service:8081`
- Frontend API calls use `/api/users/*` and `/api/payments/*`, and Nginx proxies them to backend services.
