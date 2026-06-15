# RemoteDesk Error Code Catalog (Final)

## Format: RD_{Category}{Sequence}

### Authentication (RD_Axxx)
| Code | Message | HTTP Status |
|------|---------|-------------|
| RD_A001 | Invalid email or password | 401 |
| RD_A002 | Account locked | 423 |
| RD_A003 | Session expired | 401 |
| RD_A004 | Invalid MFA code | 401 |
| RD_A005 | MFA required | 403 |
| RD_A006 | Token invalid | 401 |
| RD_A007 | Token expired | 401 |
| RD_A008 | Account disabled | 403 |
| RD_A009 | Email not verified | 403 |
| RD_A010 | Too many login attempts | 429 |

### Session (RD_Sxxx)
| Code | Message | HTTP Status |
|------|---------|-------------|
| RD_S001 | Session not found | 404 |
| RD_S002 | Desk ID invalid | 400 |
| RD_S003 | Session expired | 410 |
| RD_S004 | Host rejected connection | 403 |
| RD_S005 | Host not available | 404 |
| RD_S006 | Session limit reached | 429 |
| RD_S007 | Session already active | 409 |
| RD_S008 | Session timed out | 408 |

### WebRTC (RD_Wxxx)
| Code | Message | HTTP Status |
|------|---------|-------------|
| RD_W001 | WebRTC not supported | 400 |
| RD_W002 | Camera not available | 400 |
| RD_W003 | Microphone not available | 400 |
| RD_W004 | Screen capture denied | 403 |
| RD_W005 | ICE connection failed | 500 |
| RD_W006 | TURN server unavailable | 503 |
| RD_W007 | Bandwidth too low | 400 |

### Permission (RD_Pxxx)
| Code | Message | HTTP Status |
|------|---------|-------------|
| RD_P001 | Permission denied | 403 |
| RD_P002 | Admin access required | 403 |
| RD_P003 | Feature not available on plan | 403 |
| RD_P004 | Rate limit exceeded | 429 |
| RD_P005 | Quota exceeded | 429 |

### Network (RD_Nxxx)
| Code | Message | HTTP Status |
|------|---------|-------------|
| RD_N001 | Network error | 503 |
| RD_N002 | Request timeout | 408 |
| RD_N003 | DNS resolution failed | 503 |
| RD_N004 | TLS handshake failed | 525 |

### System (RD_Xxxx)
| Code | Message | HTTP Status |
|------|---------|-------------|
| RD_X001 | Internal server error | 500 |
| RD_X002 | Service unavailable | 503 |
| RD_X003 | Database error | 500 |
| RD_X004 | Cache error | 500 |
| RD_X005 | External service error | 502 |

### Validation (RD_Vxxx)
| Code | Message | HTTP Status |
|------|---------|-------------|
| RD_V001 | Invalid input | 400 |
| RD_V002 | Missing required field | 400 |
| RD_V003 | Invalid email format | 400 |
| RD_V004 | Password too weak | 400 |
| RD_V005 | Invalid file type | 400 |

## Response Format
```json
{
  "error": {
    "code": "RD_A001",
    "message": "Invalid email or password",
    "category": "authentication",
    "details": {
      "field": "password",
      "attempt": 3,
      "maxAttempts": 5
    },
    "requestId": "req_abc123",
    "timestamp": "2026-06-12T10:00:00Z"
  }
}
```
