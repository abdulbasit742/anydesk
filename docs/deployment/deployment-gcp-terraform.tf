# RemoteDesk GCP Terraform
terraform {
  required_providers {
    google = { source = "hashicorp/google" version = "~> 5.0" }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

variable "project_id" {}
variable "region" { default = "us-central1" }

resource "google_sql_database_instance" "postgres" {
  name             = "remotedesk-db"
  database_version = "POSTGRES_15"
  region           = var.region
  settings {
    tier = "db-custom-2-4096"
    availability_type = "REGIONAL"
    backup_configuration { enabled = true }
  }
}

resource "google_redis_instance" "cache" {
  name           = "remotedesk-redis"
  tier           = "STANDARD_HA"
  memory_size_gb = 2
  region         = var.region
}
