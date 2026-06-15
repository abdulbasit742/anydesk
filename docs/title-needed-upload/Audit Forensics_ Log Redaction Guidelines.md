# Audit/Forensics: Log Redaction Guidelines

Log redaction is the process of automatically identifying and removing or masking sensitive information from audit logs before they are stored or viewed. This is crucial for protecting user privacy, complying with data protection regulations (like GDPR, HIPAA), and ensuring that logs themselves do not become a security risk. This document outlines the guidelines and strategies for log redaction in RemoteDesk.

## 1. What Information Should be Redacted?

The following types of sensitive information MUST be redacted from all audit logs:

*   **Credentials:** Passwords, API keys, secrets, authentication tokens.
*   **Personally Identifiable Information (PII):** Full names, home addresses, phone numbers, personal email addresses (unless essential and properly handled).
*   **Financial Information:** Credit card numbers, bank account details, transaction amounts (if sensitive).
*   **Sensitive User Content:** Clipboard content, file names (if they contain PII), chat messages (unless auditing is specifically required and authorized).
*   **Internal System Details:** Detailed stack traces (in production logs shown to users), internal IP addresses (if not needed for correlation), database connection strings.

## 2. Redaction Strategies

### 2.1. Masking

Replacing sensitive data with a standardized placeholder.
*   **Example:** `password: "********"`, `credit_card: "XXXX-XXXX-XXXX-1234"`

### 2.2. Hashing

Replacing sensitive data with a one-way cryptographic hash. This allows for correlation without revealing the original data.
*   **Example:** `email_hash: "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3"`

### 2.3. Redaction (Removal)

Completely removing the sensitive field or its value from the log entry.
*   **Example:** `details: { "action": "login", "result": "success" }` (The `password` field is omitted entirely).

### 2.4. Generalization

Replacing specific values with broader categories.
*   **Example:** Replacing a specific IP address with its country or city.

## 3. Implementation Guidelines

### 3.1. Redaction at the Source

The best place to redact information is at the point where the log entry is generated.

```typescript
// Example: Redacting a password before logging
function logLoginAttempt(email, password, status) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event_type: 'user_login',
    user_email: email,
    password: '[REDACTED]', // Never log the actual password
    status: status
  };
  logger.info(logEntry);
}
```

### 3.2. Using Middleware or Interceptors

For web applications and APIs, use middleware to automatically redact sensitive fields from request and response bodies before logging them.

```typescript
// Conceptual middleware for log redaction
function redactionMiddleware(req, res, next) {
  const sensitiveFields = ['password', 'token', 'creditCard'];
  
  // Redact fields in req.body, req.headers, etc.
  const redactedBody = redact(req.body, sensitiveFields);
  
  // Log the redacted request
  logger.info({ method: req.method, url: req.url, body: redactedBody });
  
  next();
}
```

### 3.3. Centralized Redaction in the Logging Pipeline

If logs are collected from multiple sources, implement a centralized redaction step in the logging pipeline (e.g., using Logstash filters or a custom log processor) before the logs are indexed and stored.

## 4. Best Practices

*   **Define a Clear Redaction Policy:** Document exactly what needs to be redacted and why.
*   **Regularly Review Redaction Rules:** As the application evolves, new sensitive fields may be introduced. Update redaction rules accordingly.
*   **Test Redaction:** Verify that redaction rules are working correctly and that no sensitive information is leaking into logs.
*   **Balance Security and Debugging:** Redaction should not make logs useless for troubleshooting. Ensure that enough non-sensitive context is preserved.
*   **Use Standardized Placeholders:** Use consistent placeholders like `[REDACTED]` or `********` to make it clear that data has been removed.

## 5. Related Documents

*   `audit-log-structure.md`
*   `security-developer-best-practices.md`
*   `audit-log-forensic-analysis.md`
