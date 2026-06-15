# Data Inventory

## Personal Data
| Category | Data Elements | Purpose | Legal Basis | Retention |
|----------|--------------|---------|-------------|-----------|
| Account | Email, name, password hash | Authentication | Contract | Account lifetime |
| Session | IP address, user agent | Security, troubleshooting | Legitimate interest | 90 days |
| Billing | Payment method (via Stripe), plan | Subscription processing | Contract | 7 years (tax) |
| Device | Device name, OS, version | Device management | Contract | Account lifetime |
| Usage | Session logs, feature usage | Product improvement | Consent | 1 year |

## Sensitive Data
We do NOT process:
- Health data
- Biometric data
- Genetic data
- Racial/ethnic origin data
- Political opinions
- Religious beliefs

## Data Processors
| Processor | Purpose | Location | DPA Signed? |
|-----------|---------|----------|-------------|
| Stripe | Payments | US | Yes |
| AWS | Hosting | EU/US | Yes |
| SendGrid | Emails | US | Yes |

## Data Flows
1. User registration -> API -> Database (encrypted at rest)
2. Session -> WebRTC (P2P, encrypted) -> No server storage
3. File transfer -> P2P encrypted -> No server storage
4. Chat messages -> P2P encrypted -> No server storage
5. Billing -> Stripe (tokenized) -> API stores subscription status only
