# Admin Team Setup Guide

## Creating Teams

### Why Teams?
Teams help you organize users and apply policies at the group level.

### Steps
1. Admin Dashboard -> Teams
2. Click "Create Team"
3. Enter team name and description
4. Assign team lead
5. Add team members
6. Set team-specific policies

### Team Structure Example
```
RemoteDesk Org
├── IT Team
│   ├── Admin: Alice
│   └── Members: Bob, Carol
├── Sales Team
│   ├── Admin: Dave
│   └── Members: Eve, Frank
└── Support Team
    ├── Admin: Grace
    └── Members: Heidi, Ivan
```

### Team Permissions
| Permission | Description |
|------------|-------------|
| View team sessions | See sessions within team |
| Manage team devices | Trust/untrust devices |
| Invite team members | Add users to team |
| Remove team members | Remove users from team |
| Set team policies | Override org policies |

## Cross-Team Policies
- Org policies apply to all teams
- Team policies override org policies
- Policy inheritance is additive
- Locked policies cannot be overridden

## Best Practices
- Create teams by department or function
- Assign at least one team admin
- Document team purpose
- Review team membership monthly
- Remove inactive members
