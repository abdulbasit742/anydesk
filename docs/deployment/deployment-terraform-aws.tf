# RemoteDesk AWS Terraform Configuration
terraform {
  required_providers { aws = { source = "hashicorp/aws" version = "~> 5.0" } }
}

provider "aws" { region = var.aws_region }

variable "aws_region" { default = "us-east-1" }
variable "instance_count" { default = 3 }

resource "aws_ecs_cluster" "remotedesk" {
  name = "remotedesk-cluster"
}

resource "aws_db_instance" "postgres" {
  identifier = "remotedesk-db"
  engine = "postgres"
  instance_class = "db.r6g.xlarge"
  allocated_storage = 100
  multi_az = true
}

resource "aws_elasticache_replication_group" "redis" {
  replication_group_id = "remotedesk-redis"
  node_type = "cache.r6g.large"
  num_cache_clusters = 2
  automatic_failover_enabled = true
}
