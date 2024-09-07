resource "flux_bootstrap_git" "main" {
  embedded_manifests = true
  path               = "kubernetes/clusters/local"
}
