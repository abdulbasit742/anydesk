import OpenAI from "openai";
import { prisma } from "../lib/prisma.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const aiSupportService = {
  // Diagnose system issues
  async diagnoseSystem(userId: string, deviceId: string, systemInfo: any) {
    const message = `
      Analyze this system information and identify potential issues:
      
      CPU: ${systemInfo.cpu}
      RAM: ${systemInfo.ram}
      Disk: ${systemInfo.disk}
      Processes: ${JSON.stringify(systemInfo.processes)}
      Services: ${JSON.stringify(systemInfo.services)}
      Event Logs: ${JSON.stringify(systemInfo.eventLogs)}
      
      Provide:
      1. List of identified issues
      2. Severity level for each issue
      3. Recommended fixes
      4. Bash/PowerShell scripts to fix each issue
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: message }],
      temperature: 0.7,
    });

    const aiResponse = response.choices[0]?.message?.content || "";

    // Store interaction
    const interaction = await prisma.aIInteraction.create({
      data: {
        userId,
        deviceId,
        type: "diagnosis",
        systemInfo,
        aiResponse,
      },
    });

    return { interaction, diagnosis: aiResponse };
  },

  // Execute fix
  async executeFix(userId: string, deviceId: string, fixScript: string) {
    // TODO: Send script to device for execution
    // For now, just log the interaction

    const interaction = await prisma.aIInteraction.create({
      data: {
        userId,
        deviceId,
        type: "fix_execution",
        aiResponse: `Executing fix script:\n${fixScript}`,
        executedFixes: [{ script: fixScript, status: "pending" }],
      },
    });

    return interaction;
  },

  // AI chat
  async chat(userId: string, deviceId: string, message: string) {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an IT support specialist helping diagnose and fix remote computer issues. Be concise and actionable.",
        },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    const aiResponse = response.choices[0]?.message?.content || "";

    const interaction = await prisma.aIInteraction.create({
      data: {
        userId,
        deviceId,
        type: "chat",
        aiResponse,
      },
    });

    return { interaction, response: aiResponse };
  },

  // Get AI interaction history
  async getHistory(userId: string, deviceId?: string, limit: number = 50) {
    const where: any = { userId };
    if (deviceId) where.deviceId = deviceId;

    return prisma.aIInteraction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  // Add to knowledge base
  async addKnowledgeBase(userId: string, title: string, issue: string, solution: string, scriptContent?: string) {
    return prisma.aIKnowledgeBase.create({
      data: {
        userId,
        title,
        description: issue,
        issue,
        solution,
        scriptContent,
        isCustom: true,
      },
    });
  },

  // Get knowledge base
  async getKnowledgeBase(userId: string) {
    return prisma.aIKnowledgeBase.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  // Update AI configuration
  async updateConfig(userId: string, config: any) {
    return prisma.aIConfiguration.upsert({
      where: { userId },
      create: { userId, ...config },
      update: config,
    });
  },

  // Get AI configuration
  async getConfig(userId: string) {
    return prisma.aIConfiguration.findUnique({
      where: { userId },
    });
  },
};
