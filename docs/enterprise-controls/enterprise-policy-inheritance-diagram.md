# Policy Inheritance Diagram

```
Organization Root
  ├── Team: Engineering (overrides root remote_input -> allow)
  │     ├── Group: Backend (inherits team)
  │     └── Group: Frontend (overrides clipboard -> deny)
  ├── Team: Sales (inherits root)
  │     └── Group: SDRs (overrides unattended -> deny)
  └── Team: Support (overrides root)
        └── Group: L1 (inherits team)
```

Resolution: bottom-up, nearest wins, locked values cannot be overridden.
