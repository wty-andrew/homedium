variable "github_user" {
  type = string
}

variable "github_repository" {
  type = string
}

variable "github_token" {
  sensitive = true
  type      = string
}
