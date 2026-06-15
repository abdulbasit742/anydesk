# RemoteDesk Translation Workflow

## Process
```
1. Developer adds English string
   ↓
2. Automated: Extract to en.json
   ↓
3. Translator translates via TMS
   ↓
4. Reviewer approves translation
   ↓
5. Automated: Sync to codebase
   ↓
6. QA verifies in staging
   ↓
7. Deploy
```

## Tools
- **TMS**: Crowdin / Phrase / Weblate
- **Format**: ICU MessageFormat
- **Storage**: JSON files in repo

## Key Naming Convention
```
{category}.{subcategory}.{action}

Examples:
session.connect.title
session.connect.description
session.error.notFound
user.profile.name
auth.login.button
```

## Translation Guidelines
1. Keep original meaning
2. Maintain placeholder variables {name}
3. Respect ICU pluralization
4. Keep similar length if possible
5. Use formal tone for enterprise
6. Test in UI before submitting

## Quality Checks
- Missing translations flagged
- Placeholder validation
- Length warnings
- Consistency checks
- Terminology validation

## Automation
```yaml
# .github/workflows/i18n.yml
name: i18n
on:
  push:
    paths:
      - "apps/web/src/i18n/messages/**"
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run i18n:extract
      - run: npm run i18n:upload
      - run: npm run i18n:download
      - run: npm run i18n:verify
```
