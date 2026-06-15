# Security Scan Automation

## CI/CD Integration
```yaml
security_scan:
  stage: test
  script:
    - trivy fs --exit-code 1 --severity HIGH .
    - semgrep --config=auto .
    - npm audit --audit-level=moderate
```

## Schedule
- SAST: Every PR
- DAST: Weekly
- Container: Every build
- Dependencies: Daily
