# TURN Server Outage Runbook

## Symptoms
- Clients behind NAT cannot connect
- Connections fail with ICE timeout
- Relay candidates not gathered

## Checks
```bash
# Process status
systemctl status coturn

# Ports listening
netstat -tlnp | grep turnserver

# CPU/Memory
top -p $(pgrep turnserver)

# Disk space
df -h /var/log/coturn

# Active allocations
turnserver -l | head -20

# Network
ping turn.remotedesk.io
telnet turn.remotedesk.io 3478
```

## Common Issues

### Process Crashed
```bash
systemctl restart coturn
journalctl -u coturn -f
```

### Disk Full
```bash
# Clean old logs
find /var/log/coturn -name "*.log" -mtime +7 -delete
```

### Port Blocked
```bash
# Verify firewall rules
iptables -L | grep 3478
```

### Certificate Expired
```bash
certbot renew
systemctl restart coturn
```

## Failover
1. Update DNS to backup TURN
2. Update app config to use backup
3. Restart app instances
4. Verify failover working

## Post-Recovery
- Root cause analysis
- Capacity planning review
- Monitoring improvements
