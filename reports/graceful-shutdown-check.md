# Graceful Shutdown Check
Status: **PASS**
Failures: **0**
| Check | Passed |
|---|---:|
| shutdownFileExists | yes |
| serverFileExists | yes |
| healthFileExists | yes |
| exportsInstaller | yes |
| marksNotReadyWithReason | yes |
| closesSocketServer | yes |
| closesHttpServer | yes |
| disconnectsPrisma | yes |
| handlesSigterm | yes |
| handlesSigint | yes |
| hasForceTimeout | yes |
| preventsDoubleShutdown | yes |
| logsLifecycleEvents | yes |
| serverImportsInstaller | yes |
| serverCapturesSocketInstance | yes |
| serverInstallsShutdown | yes |
| serverDefinesRequestTimeout | yes |
| serverDefinesHeadersTimeout | yes |
| serverDefinesKeepAliveTimeout | yes |
| serverAppliesRequestTimeout | yes |
| serverAppliesHeadersTimeout | yes |
| serverAppliesKeepAliveTimeout | yes |
| serverAppliesLegacyTimeout | yes |
| healthCanMarkNotReady | yes |
| healthTracksReadinessReason | yes |
| healthTracksReadinessChangedAt | yes |
| healthReadinessIncludesUptime | yes |
| dependencyFileExists | yes |
| dependencyExportsDatabaseCheck | yes |
| dependencyUsesPrismaQuery | yes |
| dependencyReportsDegraded | yes |
| dependencyReportsCache | yes |
| dependencyHasCacheTtl | yes |
| dependencyHasTimeout | yes |
| dependencyUsesPromiseRace | yes |
| dependencyReportsTimedOut | yes |
| dependencyTimerUnrefed | yes |
| serverImportsDependencyCheck | yes |
| serverHasReadinessBodyHelper | yes |
| serverReadinessIncludesDependencies | yes |
| serverReadyRequiresDatabaseOk | yes |
| readyRoutesReturn503WhenNotReady | yes |