# RemoteDesk Enterprise Cloud Deployment Guide

## Architecture
```
CDN -> Load Balancer -> App Servers (3+) -> Primary DB
                                  |\n                              Read Replica
                                  |\n                              Redis Cluster
```

## AWS Reference
| Component | Service | Size |
|-----------|---------|------|
| App | ECS Fargate | 2 vCPU / 4GB x 3 |
| DB | RDS PostgreSQL | db.r6g.xlarge |
| Cache | ElastiCache Redis | cache.r6g.large |
| LB | ALB | - |
| CDN | CloudFront | - |
| TURN | EC2 (Coturn) | c6g.large |
| Storage | S3 | - |
| DNS | Route53 | - |

## Azure Reference
| Component | Service | Size |
|-----------|---------|------|
| App | AKS / Container Apps | 2 vCPU / 4GB x 3 |
| DB | Azure PostgreSQL | GP_Gen5_4 |
| Cache | Azure Redis | C2 |
| LB | Application Gateway | Medium |

## Terraform
```bash
cd infra/terraform
terraform init
terraform plan -var-file=enterprise.tfvars
terraform apply
```

## High Availability
- Multi-AZ deployment
- Auto-scaling: CPU > 70%
- DB failover: < 60s
- Health checks every 30s
