$ErrorActionPreference = "Stop"

if (-not (Get-Command kubectl -ErrorAction SilentlyContinue)) {
    throw "Required command not found: kubectl"
}

Write-Host "Deleting Kubernetes resources..."
kubectl delete -k ./k8s
if ($LASTEXITCODE -ne 0) { throw "Failed to delete Kubernetes resources" }

Write-Host "Cleanup complete."
