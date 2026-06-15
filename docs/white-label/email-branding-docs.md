# RemoteDesk Email Branding

## Customizable Elements

### From Address
```
Default: noreply@remotedesk.io
Custom:  noreply@yourdomain.com
```

### Email Templates
| Template | Variables |
|----------|-----------|
| Welcome | {name}, {desk_id}, {login_url} |
| Password reset | {name}, {reset_link}, {expiry} |
| Session invitation | {host_name}, {desk_id}, {join_url} |
| Security alert | {alert_type}, {details}, {action_url} |
| Invoice | {amount}, {due_date}, {invoice_url} |

### Template Structure
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{{subject}}</title>
  <style>
    :root {
      --primary: {{brand.primary_color}};
      --logo: {{brand.logo_url}};
    }
  </style>
</head>
<body>
  <header>
    <img src="{{brand.logo_url}}" alt="{{brand.name}}">
  </header>
  <main>
    {{content}}
  </main>
  <footer>
    <p>{{brand.support_email}}</p>
    <p>{{brand.address}}</p>
  </footer>
</body>
</html>
```

## DKIM/SPF Setup
For custom domain emails:

### SPF Record
```
v=spf1 include:sendgrid.net include:yourdomain.com ~all
```

### DKIM Record
Provided after domain verification in dashboard.

## Best Practices
- Keep emails under 102KB
- Mobile-friendly width (600px max)
- Alt text on images
- Plain text fallback
- Test in multiple clients
