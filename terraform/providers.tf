terraform {
  required_version = ">= 1.9.0"

  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.32"
    }
    flux = {
      source  = "fluxcd/flux"
      version = ">= 1.3"
    }
  }
}

provider "kubernetes" {
  config_path    = "~/.kube/config"
  config_context = "minikube"
}

provider "flux" {
  kubernetes = {
    config_path    = "~/.kube/config"
    config_context = "minikube"
  }
  git = {
    url = "https://github.com/${var.github_user}/${var.github_repository}.git"
    http = {
      username = "git"
      password = var.github_token
    }
  }
}
