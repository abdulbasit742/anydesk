# Auth Hardening Check
Status: **PASS**
Failures: **0**
| Check | Passed |
|---|---:|
| tokensFileExists | yes |
| authRoutesFileExists | yes |
| hasVerifyRefreshToken | yes |
| accessUsesJwtSecret | yes |
| refreshUsesRefreshSecret | yes |
| validatesTokenPayload | yes |
| hasIssueTokenPair | yes |
| authRouteHasRefreshEndpoint | yes |
| refreshEndpointVerifiesRefreshToken | yes |
| authResponsesUseIssueTokenPair | yes |
| importsRateLimit | yes |
| definesAuthRateLimit | yes |
| appliesSignupRateLimit | yes |
| appliesLoginRateLimit | yes |
| appliesRefreshRateLimit | yes |
| emailTrimsBeforeValidation | yes |
| emailIsLowercased | yes |
| doesNotReturnPasswordHash | yes |