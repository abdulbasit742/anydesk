# RemoteDesk Engine Safety Scan

Status: **PASS**
Findings: **19**
Blocking P0 findings: **0**

| Severity | Pattern | File | Line | Allowed | Preview |
|---|---|---|---:|---:|---|
| P0 | sendinput | apps/api/src/devices/implementations/SmartphoneDevice.ts | 139 | yes |           result = await this.sendInput(command.params); |
| P0 | sendinput | apps/api/src/devices/implementations/SmartphoneDevice.ts | 200 | yes |   private async sendInput(params: any): Promise<any> { |
| P0 | powershell | apps/api/src/lib/ai.ts | 76 | yes | Generate a safe, effective script (PowerShell for Windows, Bash for Linux/macOS) to resolve this issue. |
| P0 | powershell | apps/api/src/routes/multiplatform/remoteShell.routes.ts | 13 | yes |   shell: z.enum(["bash", "sh", "zsh", "powershell"]).optional(), |
| P0 | powershell | apps/desktop/src/main/aiSupportIpc.ts | 6 | yes |  *  - Auto-fix script execution (PowerShell / Bash) |
| P1 | child-process-exec | apps/desktop/src/main/aiSupportIpc.ts | 15 | yes | import { exec, spawn } from "node:child_process"; |
| P0 | powershell | apps/desktop/src/main/aiSupportIpc.ts | 74 | yes |         `powershell -Command "Get-EventLog -LogName System -EntryType Error -Newest 5 \| Select-Object -ExpandProperty Message"`, |
| P0 | powershell | apps/desktop/src/main/aiSupportIpc.ts | 155 | yes |         ? `powershell -ExecutionPolicy Bypass -File "${scriptPath}"` |
| P0 | powershell | apps/desktop/src/main/aiSupportIpc.ts | 183 | yes |       command = `powershell -Command "Restart-Service -Name '${serviceName}' -Force"`; |
| P0 | powershell | apps/desktop/src/main/aiSupportIpc.ts | 276 | yes |       command = `powershell -Command " |
| P1 | child-process-exec | apps/desktop/src/main/cloudGamingIpc.ts | 9 | yes | import { execSync, exec } from "node:child_process"; |
| P0 | powershell | apps/desktop/src/main/cloudGamingIpc.ts | 286 | yes |       const output = execSync("powershell -Command \"Confirm-SecureBootUEFI\" 2>nul", { timeout: 5000 }).toString().trim(); |
| P0 | powershell | apps/desktop/src/main/cloudGamingIpc.ts | 337 | yes |         const output = execSync("powershell -Command \"Get-WmiObject -Namespace root\\wmi -Class WmiMonitorBasicDisplayParams \| Select-Object -Property Active,M |
| P0 | powershell | apps/desktop/src/main/cloudGamingIpc.ts | 369 | yes |         const output = execSync("powershell -Command \"(Get-WmiObject -Namespace root\\wmi -Class WmiMonitorColorCharacteristics).DefaultColorSpace\" 2>nul", {  |
| P0 | osascript | apps/desktop/src/main/remoteControlIpc.ts | 86 | yes |         command = "osascript -e 'tell application \"System Events\" to log out'"; |
| P0 | powershell | apps/desktop/src/main/zeroTrustIpc.ts | 53 | yes |       const out = execSync("powershell -command \"Confirm-SecureBootUEFI\"", { encoding: "utf8", timeout: 5000 }); |
| P0 | powershell | apps/desktop/src/main/zeroTrustIpc.ts | 67 | yes |       const out = execSync("powershell -command \"Get-Tpm \| Select-Object -ExpandProperty TpmPresent\"", { encoding: "utf8", timeout: 5000 }); |
| P0 | powershell | generated-kimi-title-analysis-manifest.json | 466 | yes |                             "path":  "windows-powershell-run-guide.md", |
| P0 | powershell | generated-remotedesk-self-work-launch-operations-summary.md | 47 | yes | Node/npm were unavailable in this environment, so Prisma generation, TypeScript checks, and Next/API builds could not run here. JSON/report/source scans were ru |

This scan blocks unsafe OS-level remote-input APIs outside documented/test contexts.