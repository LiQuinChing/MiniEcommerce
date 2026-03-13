$ErrorActionPreference = "Stop"

if (-not (Get-Command kubectl -ErrorAction SilentlyContinue)) {
    throw "Required command not found: kubectl"
}

kubectl get pods -n mini-ecommerce
kubectl get svc -n mini-ecommerce
