# Large Enterprise Deployment Blueprint

```
[Users] -> [Cloudflare] -> [ALB] -> [API Cluster]
                                        |
                                  [RDS Primary] <-> [RDS Replica]
                                        |
                                  [ElastiCache Cluster]
                                        |
                                  [TURN Cluster]
```

Specs: 10+ API instances, multi-AZ DB
Cost: ~$3,000/month
