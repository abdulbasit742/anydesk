import OpenAI from "openai";
import { env } from "../config/env.js";

// Use environment variables for OpenAI configuration
const openai = new OpenAI({
  apiKey: env.openaiApiKey || process.env.OPENAI_API_KEY || "dummy-key-for-build",
  baseURL: process.env.OPENAI_API_BASE || undefined,
});

export interface SystemState {
  cpuUsage: number;
  memoryUsage: number;
  totalMemory: number;
  diskUsage: number;
  totalDisk: number;
  activeProcesses: string[];
  recentErrors: string[];
  osVersion: string;
}

export const aiService = {
  /**
   * Analyze system state and generate a diagnostic report
   */
  async analyzeSystemState(state: SystemState) {
    const prompt = `
Analyze the following system state and provide a diagnostic report.
Identify any potential issues (e.g., high CPU, low memory, full disk, suspicious processes).
Recommend specific actions to resolve the issues.

System State:
- OS: ${state.osVersion}
- CPU Usage: ${state.cpuUsage}%
- Memory Usage: ${state.memoryUsage}MB / ${state.totalMemory}MB
- Disk Usage: ${state.diskUsage}GB / ${state.totalDisk}GB
- Active Processes: ${state.activeProcesses.join(", ")}
- Recent Errors: ${state.recentErrors.join(", ")}

Respond in JSON format:
{
  "cpuStatus": "normal" | "high" | "critical",
  "memoryStatus": "normal" | "high" | "critical",
  "diskStatus": "normal" | "high" | "critical",
  "networkStatus": "normal" | "high" | "critical",
  "securityStatus": "secure" | "warning" | "critical",
  "analysis": "Detailed explanation of findings...",
  "recommendedActions": "Step-by-step recommendations..."
}
`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error("No response from AI");
      
      return JSON.parse(content);
    } catch (error) {
      console.error("AI Diagnostics failed:", error);
      throw new Error("Failed to generate AI diagnostics");
    }
  },

  /**
   * Generate an auto-fix script based on an issue description
   */
  async generateFixScript(issue: string, os: string) {
    const prompt = `
You are an expert IT support agent. The user is experiencing the following issue on ${os}:
"${issue}"

Generate a safe, effective script (PowerShell for Windows, Bash for Linux/macOS) to resolve this issue.
The script will be executed automatically on the remote machine.
DO NOT include any destructive commands (e.g., formatting disks, deleting user files).

Respond in JSON format:
{
  "script": "The actual script code",
  "explanation": "Brief explanation of what the script does",
  "requiresReboot": boolean
}
`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error("No response from AI");
      
      return JSON.parse(content);
    } catch (error) {
      console.error("AI Script generation failed:", error);
      throw new Error("Failed to generate auto-fix script");
    }
  },

  /**
   * Parse natural language command into structured action
   */
  async parseNaturalLanguageCommand(command: string, os: string) {
    const prompt = `
Convert the following natural language IT support command into a structured system action for ${os}.
Command: "${command}"

Examples of actions:
- type: "run_script", payload: { script: "..." }
- type: "restart_service", payload: { serviceName: "..." }
- type: "kill_process", payload: { processName: "..." }
- type: "open_app", payload: { appName: "..." }

Respond in JSON format:
{
  "type": "string",
  "payload": { ... },
  "explanation": "What this action will do"
}
`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error("No response from AI");
      
      return JSON.parse(content);
    } catch (error) {
      console.error("AI Command parsing failed:", error);
      throw new Error("Failed to parse natural language command");
    }
  },

  /**
   * Summarize a session replay
   */
  async summarizeSession(eventsJson: string) {
    const prompt = `
Summarize the following remote IT support session events.
Identify the main issues addressed, actions taken, and the final resolution status.

Events:
${eventsJson.substring(0, 10000)} // Truncate to avoid token limits

Respond in JSON format:
{
  "summary": "High-level summary of the session...",
  "issuesAddressed": ["Issue 1", "Issue 2"],
  "resolutionStatus": "resolved" | "unresolved" | "partial",
  "recommendations": "Any follow-up recommendations for the user..."
}
`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error("No response from AI");
      
      return JSON.parse(content);
    } catch (error) {
      console.error("AI Session summarization failed:", error);
      throw new Error("Failed to summarize session");
    }
  }
};
