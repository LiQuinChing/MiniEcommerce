$ErrorActionPreference = "Stop"

function Assert-CommandExists {
    param([string]$Name)
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command not found: $Name"
    }
}

Write-Host "Checking prerequisites..."
Assert-CommandExists -Name docker
Assert-CommandExists -Name kubectl

try {
    $null = docker info
} catch {
    throw "Docker daemon is not running. Start Docker Desktop first."
}

$context = kubectl config current-context 2>$null
if (-not $context) {
    throw "Kubernetes context is not set. Enable Kubernetes in Docker Desktop, then run: kubectl config use-context docker-desktop"
}

Write-Host "Using Kubernetes context: $context"
Write-Host "Building Docker images..."

docker build -t miniecommerce/user-service:latest ./server/user-service
if ($LASTEXITCODE -ne 0) { throw "Failed to build user-service image" }

docker build -t miniecommerce/payment-service:latest ./server/payment-service
if ($LASTEXITCODE -ne 0) { throw "Failed to build payment-service image" }

docker build -t miniecommerce/client:latest ./client
if ($LASTEXITCODE -ne 0) { throw "Failed to build client image" }

Write-Host "Applying Kubernetes manifests..."
kubectl apply -k ./k8s
if ($LASTEXITCODE -ne 0) { throw "Failed to apply Kubernetes manifests" }

Write-Host "Restarting deployments to pick up latest images..."
kubectl rollout restart deployment/user-service -n mini-ecommerce
kubectl rollout restart deployment/payment-service -n mini-ecommerce
kubectl rollout restart deployment/client -n mini-ecommerce

Write-Host "Waiting for rollouts..."
kubectl rollout status deployment/user-service -n mini-ecommerce --timeout=180s
kubectl rollout status deployment/payment-service -n mini-ecommerce --timeout=180s
kubectl rollout status deployment/client -n mini-ecommerce --timeout=180s

Write-Host "Deployment complete."
Write-Host "Frontend: http://localhost:30080"
kubectl get pods -n mini-ecommerce
kubectl get svc -n mini-ecommerce
