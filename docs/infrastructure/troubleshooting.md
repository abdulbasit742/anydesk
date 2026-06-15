# Infrastructure Troubleshooting

## API not starting
Check logs: `docker logs remotedesk-api-1`
Common issues:
- Database connection refused → Check DB_PASSWORD
- Port already in use → Stop conflicting service
- Migration failure → Check schema compatibility

## WebRTC connection failing
- Verify Coturn is running: `docker logs remotedesk-coturn-1`
- Check firewall rules for UDP range
- Verify TURN credentials in `.env`
- Test with: https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/

## Database issues
- Connect: `docker exec -it remotedesk-db-1 psql -U postgres -d remotedesk`
- Check connections: `SELECT count(*) FROM pg_stat_activity;`
- Slow queries: `SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;`

## High memory usage
- Check for memory leaks in API: `docker stats`
- Restart services: `docker compose restart`
- Scale if needed: `docker compose up -d --scale api=2`
