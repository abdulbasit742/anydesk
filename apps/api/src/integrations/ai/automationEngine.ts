/**
 * Automation Engine for RemoteDesk.
 * Adapted from calesthio-OpenMontage automation scripts.
 * Provides: scheduled tasks, workflow builder, task pipelines, health checks.
 */

export interface AutomationTask {
  id: string;
  name: string;
  description: string;
  type: 'script' | 'command' | 'workflow' | 'health_check' | 'maintenance';
  schedule: CronSchedule | null;
  targetDevices: string[];
  script: string;
  os: 'windows' | 'linux' | 'macos' | 'all';
  enabled: boolean;
  lastRun: Date | null;
  lastResult: TaskResult | null;
  createdBy: string;
  tags: string[];
}

export interface CronSchedule {
  expression: string; // e.g., "0 2 * * *" (daily at 2am)
  timezone: string;
  nextRun: Date;
}

export interface TaskResult {
  success: boolean;
  output: string;
  errorOutput: string;
  exitCode: number;
  durationMs: number;
  timestamp: Date;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
  enabled: boolean;
  createdBy: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'command' | 'script' | 'condition' | 'wait' | 'notify' | 'approve';
  config: Record<string, unknown>;
  onSuccess: string | null; // next step ID
  onFailure: string | null; // step ID on failure
  timeout: number; // ms
}

export interface WorkflowTrigger {
  type: 'schedule' | 'event' | 'webhook' | 'manual' | 'condition';
  config: Record<string, unknown>;
}

// Pre-built automation templates
export const AUTOMATION_TEMPLATES: Partial<AutomationTask>[] = [
  {
    name: 'Daily Disk Cleanup',
    description: 'Remove temp files, browser cache, and old logs',
    type: 'script',
    os: 'windows',
    script: `
# Windows Disk Cleanup
Remove-Item -Path "$env:TEMP\\*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "C:\\Windows\\Temp\\*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:LOCALAPPDATA\\Microsoft\\Windows\\INetCache\\*" -Recurse -Force -ErrorAction SilentlyContinue
# Clear old logs (>30 days)
Get-ChildItem -Path "C:\\Windows\\Logs" -Recurse -File | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) } | Remove-Item -Force
Write-Host "Disk cleanup complete"
    `.trim(),
    tags: ['maintenance', 'disk', 'cleanup'],
  },
  {
    name: 'Daily Disk Cleanup (Linux)',
    description: 'Remove temp files, old logs, and package cache',
    type: 'script',
    os: 'linux',
    script: `
#!/bin/bash
# Linux Disk Cleanup
rm -rf /tmp/* 2>/dev/null
find /var/log -name "*.gz" -mtime +30 -delete
find /var/log -name "*.old" -mtime +7 -delete
apt-get autoremove -y 2>/dev/null
apt-get clean 2>/dev/null
journalctl --vacuum-time=7d 2>/dev/null
echo "Disk cleanup complete"
    `.trim(),
    tags: ['maintenance', 'disk', 'cleanup'],
  },
  {
    name: 'System Health Check',
    description: 'Check CPU, RAM, disk, and network status',
    type: 'health_check',
    os: 'all',
    script: `
#!/bin/bash
echo "=== System Health Report ==="
echo "Hostname: $(hostname)"
echo "Uptime: $(uptime -p)"
echo "CPU Load: $(cat /proc/loadavg | awk '{print $1, $2, $3}')"
echo "Memory: $(free -h | grep Mem | awk '{print $3 "/" $2}')"
echo "Disk: $(df -h / | tail -1 | awk '{print $3 "/" $2 " (" $5 ")"}')"
echo "Network: $(ip route get 8.8.8.8 | head -1 | awk '{print $7}')"
echo "=== End Report ==="
    `.trim(),
    tags: ['monitoring', 'health'],
  },
  {
    name: 'Windows Update Check',
    description: 'Check for pending Windows updates',
    type: 'command',
    os: 'windows',
    script: `Get-WindowsUpdate -AcceptAll -IgnoreReboot | Format-Table -AutoSize`,
    tags: ['updates', 'windows'],
  },
  {
    name: 'SSL Certificate Expiry Check',
    description: 'Check SSL certificates expiring within 30 days',
    type: 'script',
    os: 'linux',
    script: `
#!/bin/bash
DOMAINS=("example.com" "api.example.com")
for domain in "\${DOMAINS[@]}"; do
  expiry=$(echo | openssl s_client -servername $domain -connect $domain:443 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
  if [ -n "$expiry" ]; then
    expiry_epoch=$(date -d "$expiry" +%s)
    now_epoch=$(date +%s)
    days_left=$(( (expiry_epoch - now_epoch) / 86400 ))
    echo "$domain: $days_left days remaining"
    if [ $days_left -lt 30 ]; then
      echo "WARNING: $domain certificate expires in $days_left days!"
    fi
  fi
done
    `.trim(),
    tags: ['security', 'ssl', 'monitoring'],
  },
  {
    name: 'Database Backup',
    description: 'Backup PostgreSQL database',
    type: 'script',
    os: 'linux',
    script: `
#!/bin/bash
BACKUP_DIR="/backups/db"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
pg_dump -U postgres remotedesk | gzip > "$BACKUP_DIR/remotedesk_$TIMESTAMP.sql.gz"
# Keep only last 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
echo "Backup complete: remotedesk_$TIMESTAMP.sql.gz"
    `.trim(),
    tags: ['backup', 'database'],
  },
  {
    name: 'Security Audit',
    description: 'Check for open ports, failed logins, and suspicious processes',
    type: 'script',
    os: 'linux',
    script: `
#!/bin/bash
echo "=== Security Audit ==="
echo "--- Open Ports ---"
ss -tlnp | grep LISTEN
echo "--- Failed SSH Logins (last 24h) ---"
journalctl -u sshd --since "24 hours ago" | grep "Failed" | wc -l
echo "--- High CPU Processes ---"
ps aux --sort=-%cpu | head -5
echo "--- Recent sudo usage ---"
journalctl -u sudo --since "24 hours ago" | tail -10
echo "=== End Audit ==="
    `.trim(),
    tags: ['security', 'audit'],
  },
  {
    name: 'Service Restart on Failure',
    description: 'Check if critical services are running, restart if down',
    type: 'script',
    os: 'linux',
    script: `
#!/bin/bash
SERVICES=("nginx" "postgresql" "redis-server")
for service in "\${SERVICES[@]}"; do
  if ! systemctl is-active --quiet $service; then
    echo "WARNING: $service is down, restarting..."
    systemctl restart $service
    sleep 2
    if systemctl is-active --quiet $service; then
      echo "SUCCESS: $service restarted"
    else
      echo "CRITICAL: $service failed to restart!"
    fi
  else
    echo "OK: $service is running"
  fi
done
    `.trim(),
    tags: ['monitoring', 'auto-heal'],
  },
];

// Automation scheduler
class AutomationScheduler {
  private tasks: Map<string, AutomationTask> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();

  addTask(task: AutomationTask): void {
    this.tasks.set(task.id, task);
    if (task.enabled && task.schedule) {
      this.scheduleTask(task);
    }
  }

  removeTask(taskId: string): void {
    this.tasks.delete(taskId);
    const timer = this.timers.get(taskId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(taskId);
    }
  }

  enableTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.enabled = true;
      if (task.schedule) this.scheduleTask(task);
    }
  }

  disableTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.enabled = false;
      const timer = this.timers.get(taskId);
      if (timer) {
        clearTimeout(timer);
        this.timers.delete(taskId);
      }
    }
  }

  private scheduleTask(task: AutomationTask): void {
    // Simple interval-based scheduling (production would use node-cron)
    const nextRun = task.schedule?.nextRun || new Date();
    const delay = Math.max(0, nextRun.getTime() - Date.now());

    const timer = setTimeout(() => {
      this.executeTask(task.id);
    }, delay);

    this.timers.set(task.id, timer);
  }

  async executeTask(taskId: string): Promise<TaskResult> {
    const task = this.tasks.get(taskId);
    if (!task) {
      return { success: false, output: '', errorOutput: 'Task not found', exitCode: 1, durationMs: 0, timestamp: new Date() };
    }

    const startTime = Date.now();

    // In production, this would send the script to the target device's agent
    // For now, return a placeholder
    const result: TaskResult = {
      success: true,
      output: `[Simulated] Task "${task.name}" executed on ${task.targetDevices.length} devices`,
      errorOutput: '',
      exitCode: 0,
      durationMs: Date.now() - startTime,
      timestamp: new Date(),
    };

    task.lastRun = new Date();
    task.lastResult = result;

    return result;
  }

  getTasks(): AutomationTask[] {
    return Array.from(this.tasks.values());
  }

  getTask(taskId: string): AutomationTask | undefined {
    return this.tasks.get(taskId);
  }
}

export const scheduler = new AutomationScheduler();

export default {
  scheduler,
  AUTOMATION_TEMPLATES,
};
