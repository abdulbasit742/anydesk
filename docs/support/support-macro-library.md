# RemoteDesk Support Macro Library

## Macros

### Greeting
```
Hello {{customer.name}},\n\nThank you for contacting RemoteDesk Support.\n\n[Insert response]\n\nBest regards,\n{{agent.name}}\nRemoteDesk Support
```

### Escalation
```
Hello {{customer.name}},\n\nThank you for your patience. I have escalated your case to our {{team}} team for further investigation.\n\nEscalation ID: {{ticket.id}}\nExpected response: {{sla}}\n\nWe will update you as soon as possible.\n\nBest regards,\n{{agent.name}}
```

### Resolution
```
Hello {{customer.name}},\n\nI am glad we were able to resolve your issue regarding {{issue.summary}}.\n\nIf you experience any further issues, please do not hesitate to reach out.\n\nCould you spare a moment to rate your support experience? {{survey.link}}\n\nBest regards,\n{{agent.name}}
```

### Feature Request
```
Hello {{customer.name}},\n\nThank you for your suggestion regarding {{feature.name}}.\n\nI have logged this in our feedback tracker (ID: {{feedback.id}}). Our product team reviews all submissions regularly.\n\nWhile I cannot guarantee implementation, we will notify you if this feature is added to our roadmap.\n\nBest regards,\n{{agent.name}}
```

### Billing Follow-up
```
Hello {{customer.name}},\n\nRegarding your billing inquiry (Invoice #{{invoice.number}}):\n\n[Insert resolution]\n\nIf you have any questions about your invoice, please reply to this email or contact billing@remotedesk.io.\n\nBest regards,\n{{agent.name}}
```
