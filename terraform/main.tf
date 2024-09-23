resource "kubernetes_namespace" "flux_system" {
  metadata {
    name = "flux-system"
  }
}

resource "kubernetes_secret" "sops-age" {
  depends_on = [kubernetes_namespace.flux_system]
  metadata {
    name      = "sops-age"
    namespace = "flux-system"
  }

  data = {
    "age.agekey" = "${file("${path.module}/key.txt")}"
  }

  type = "Opaque"
}

resource "flux_bootstrap_git" "main" {
  depends_on         = [kubernetes_secret.sops-age]
  embedded_manifests = true
  path               = "kubernetes/clusters/local"
}
