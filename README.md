# MiniEcommerce

Microservice-based e-commerce sample with:
- React client
- User Service (Spring Boot)
- Payment Service (Spring Boot)

## Prerequisites

- Docker Desktop is running
- Kubernetes is enabled in Docker Desktop
- kubectl context is set (example: docker-desktop)

## Docker

Build the images from the repository root:

```bash
docker build -t miniecommerce/user-service:latest ./server/user-service
docker build -t miniecommerce/payment-service:latest ./server/payment-service
docker build -t miniecommerce/client:latest ./client
```

## Kubernetes

Kubernetes manifests are in the `k8s` folder.

Apply all resources:

```bash
kubectl apply -k ./k8s
```

Check pods and services:

```bash
kubectl get pods -n mini-ecommerce
kubectl get svc -n mini-ecommerce
```

Access the frontend:
- NodePort: `http://localhost:30080`

Important:
- Do not use `http://localhost` (port 80) for this Kubernetes setup.
- If you need to force API origin manually, set `VITE_API_ORIGIN` (example: `http://localhost:30080`) when building the client image.

## Cleanup

```bash
kubectl delete -k ./k8s
```

## Windows PowerShell Scripts

From repository root:

```powershell
./scripts/deploy-k8s.ps1
```

Check status:

```powershell
./scripts/status-k8s.ps1
```

Cleanup:

```powershell
./scripts/teardown-k8s.ps1
```
