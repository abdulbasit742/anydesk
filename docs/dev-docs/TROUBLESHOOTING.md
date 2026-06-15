# Developer Troubleshooting

## Build Issues
### Module not found
```bash
rm -rf node_modules
npm install
```

### Type errors after git pull
```bash
npm run check
# Fix errors or ask in #dev-help
```

### Build fails
```bash
# Clear caches
rm -rf dist .turbo
npm run build
```

## Database Issues
### Migration fails
```bash
# Reset (dev only!)
npm run db:push

# Or fix schema and regenerate
npm run db:generate
```

### Connection refused
- Check MySQL running
- Verify DATABASE_URL
- Check firewall

## WebSocket Issues
### Can't connect
- Check WS_URL
- Verify auth token
- Check network tab

### Messages not received
- Verify event name
- Check room membership
- Enable debug logging

## Test Issues
### Flaky tests
- Add waitFor helpers
- Check async cleanup
- Mock timers properly

### Coverage not updating
```bash
rm -rf coverage
npm run test:coverage
```

## Environment
### Port in use
```bash
lsof -ti:3000 | xargs kill -9
```

### Node version mismatch
```bash
nvm use 20
# or
fnm use 20
```
