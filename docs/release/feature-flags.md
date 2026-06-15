# Feature Flags

## Implementation
```typescript
if (featureFlags.isEnabled('new-dashboard', user)) {
  return <NewDashboard />;
}
return <OldDashboard />;
```

## Rules
- User ID-based
- Organization-based
- Percentage rollout
- Date-based

## Management
- LaunchDarkly integration
- Admin dashboard control
- Audit logging
