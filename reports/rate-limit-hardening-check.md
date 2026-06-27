# Rate Limit Hardening Check
Status: **PASS**
Failures: **0**
| Check | Passed |
|---|---:|
| rateLimitFileExists | yes |
| serverFileExists | yes |
| authRoutesFileExists | yes |
| packageFileExists | yes |
| packageHasRateLimitCheckScript | yes |
| ciRunsRateLimitCheck | yes |
| exportsCreateRateLimit | yes |
| hasNamedPolicies | yes |
| hasCleanupInterval | yes |
| deletesStaleBuckets | yes |
| clampsPositiveIntegers | yes |
| checksBeforeAddingRejectedHit | yes |
| sendsRetryAfterSeconds | yes |
| sendsStandardHeaders | yes |
| sendsPolicyHeader | yes |
| globalLimiterNamed | yes |
| authLimiterStillApplied | yes |