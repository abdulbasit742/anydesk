export const chatbotService = {
  async processMessage(userId: string, message: string, context?: { deviceId?: string; sessionId?: string }): Promise<{ response: string; actions?: Array<{ type: string; label: string; payload: any }> }> {
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes("connect") || lowerMsg.includes("remote")) {
      return { response: "I can help you connect to a remote device. Which device would you like to connect to?", actions: [{ type: "list_devices", label: "Show my devices", payload: {} }] };
    }
    if (lowerMsg.includes("slow") || lowerMsg.includes("performance")) {
      return { response: "I'll run a quick diagnostic to check performance. This may take a moment.", actions: [{ type: "run_diagnostic", label: "Run Diagnostic", payload: { type: "performance" } }] };
    }
    if (lowerMsg.includes("help") || lowerMsg.includes("support")) {
      return { response: "I'm here to help! I can assist with:\n- Connecting to devices\n- Performance issues\n- Security alerts\n- Billing questions\n- Account settings\n\nWhat do you need help with?" };
    }
    return { response: "I understand you need help. Could you provide more details about what you're trying to do?" };
  },
  async getSuggestedActions(context: { deviceStatus?: string; recentIssues?: string[] }): Promise<string[]> {
    const suggestions: string[] = [];
    if (context.deviceStatus === "offline") suggestions.push("Wake device", "Check network", "View last known state");
    if (context.recentIssues?.includes("high_cpu")) suggestions.push("Kill heavy processes", "Run malware scan");
    return suggestions;
  },
};
