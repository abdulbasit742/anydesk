# DR Automation

```bash
# Trigger failover
./scripts/dr-failover.sh --region=us-west --force

# Verify
./scripts/dr-verify.sh --region=us-west

# Failback
./scripts/dr-failback.sh --region=us-east
```

All scripts are idempotent and tested monthly.
