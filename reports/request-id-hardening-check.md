# Request ID Hardening Check
Status: **PASS**
Failures: **0**
| Check | Passed |
|---|---:|
| requestIdFileExists | yes |
| packageFileExists | yes |
| packageHasTraceCheckScript | yes |
| ciRunsTraceCheck | yes |
| exportsRequestWithId | yes |
| exportsNormalizeRequestId | yes |
| exportsRequestIdHeader | yes |
| exportsRequestIdLimits | yes |
| hasMinLengthLimit | yes |
| hasMaxLengthLimit | yes |
| exportsAllowlistPattern | yes |
| hasAllowlistPattern | yes |
| rejectsShortIds | yes |
| rejectsLongIds | yes |
| rejectsPatternMismatch | yes |
| trimsIncomingIds | yes |
| readsHeaderViaConstant | yes |
| fallsBackToRandomUuid | yes |
| setsResponseHeaderViaConstant | yes |
| serverImportsRequestIdHeader | yes |
| serverDefinesCorsPreflightMaxAge | yes |
| corsUsesPreflightMaxAge | yes |
| corsUsesExplicitOptionsStatus | yes |
| serverDefinesAllowedCorsMethods | yes |
| corsUsesAllowedMethods | yes |
| serverDefinesAllowedRequestHeaders | yes |
| allowedHeadersIncludeRequestIdConstant | yes |
| serverDefinesExposedResponseHeaders | yes |
| corsExposesRequestIdHeader | yes |
| serverUsesRequestIdEarly | yes |
| errorHandlerReturnsRequestId | yes |