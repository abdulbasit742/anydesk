import { prisma } from "../lib/prisma.js";

export const supportService = {
  // Create support ticket
  async createTicket(userId: string, subject: string, priority: string = "medium", channel: string = "email") {
    return prisma.supportTicket.create({
      data: {
        userId,
        subject,
        priority,
        channel,
        status: "open",
      },
    });
  },

  // Add message to ticket
  async addTicketMessage(
    ticketId: string,
    senderId: string,
    body: string,
    isInternal: boolean = false,
    attachments: string[] = []
  ) {
    return prisma.ticketMessage.create({
      data: {
        ticketId,
        senderId,
        body,
        isInternal,
        attachments,
      },
    });
  },

  // Get ticket details
  async getTicket(ticketId: string) {
    return prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
  },

  // Get user tickets
  async getUserTickets(userId: string, status?: string) {
    const where: any = { userId };
    if (status) where.status = status;

    return prisma.supportTicket.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
    });
  },

  // Update ticket status
  async updateTicketStatus(ticketId: string, status: string) {
    const data: any = { status };
    if (status === "resolved") {
      data.resolvedAt = new Date();
    }
    return prisma.supportTicket.update({
      where: { id: ticketId },
      data,
    });
  },

  // Assign ticket
  async assignTicket(ticketId: string, assigneeId: string) {
    return prisma.supportTicket.update({
      where: { id: ticketId },
      data: { assigneeId },
    });
  },

  // Get support dashboard
  async getSupportDashboard(userId: string) {
    const tickets = await prisma.supportTicket.findMany({
      where: { userId },
    });

    const openTickets = tickets.filter((t) => t.status === "open").length;
    const inProgressTickets = tickets.filter((t) => t.status === "in_progress").length;
    const resolvedTickets = tickets.filter((t) => t.status === "resolved").length;
    const avgResolutionTime = tickets
      .filter((t) => t.resolvedAt)
      .reduce((sum, t) => {
        const time = t.resolvedAt!.getTime() - t.createdAt.getTime();
        return sum + time;
      }, 0) / (resolvedTickets || 1);

    return {
      totalTickets: tickets.length,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      avgResolutionTimeMs: avgResolutionTime,
      avgResolutionTimeHours: avgResolutionTime / (1000 * 60 * 60),
    };
  },

  // Create chat session
  async createChatSession(visitorId: string, channel: string = "web") {
    return prisma.chatSession.create({
      data: {
        visitorId,
        channel,
        status: "active",
      },
    });
  },

  // Assign agent to chat
  async assignChatAgent(chatSessionId: string, agentId: string) {
    return prisma.chatSession.update({
      where: { id: chatSessionId },
      data: { agentId, status: "active" },
    });
  },

  // End chat session
  async endChatSession(chatSessionId: string) {
    const session = await prisma.chatSession.findUnique({
      where: { id: chatSessionId },
    });

    if (!session) throw new Error("Chat session not found");

    const duration = Math.floor(
      (new Date().getTime() - session.startedAt.getTime()) / 1000
    );

    return prisma.chatSession.update({
      where: { id: chatSessionId },
      data: {
        status: "closed",
        endedAt: new Date(),
        duration,
      },
    });
  },

  // Create KB article
  async createKBArticle(
    userId: string,
    title: string,
    body: string,
    category: string,
    tags: string[] = []
  ) {
    return prisma.knowledgeBaseArticle.create({
      data: {
        userId,
        title,
        body,
        category,
        tags,
      },
    });
  },

  // Get KB articles
  async getKBArticles(userId: string, category?: string) {
    const where: any = { userId };
    if (category) where.category = category;

    return prisma.knowledgeBaseArticle.findMany({
      where,
      orderBy: { views: "desc" },
    });
  },

  // Increment KB article views
  async incrementKBViews(articleId: string) {
    return prisma.knowledgeBaseArticle.update({
      where: { id: articleId },
      data: { views: { increment: 1 } },
    });
  },

  // Mark KB article as helpful
  async markKBHelpful(articleId: string, helpful: boolean) {
    const field = helpful ? "helpfulCount" : "unhelpfulCount";
    return prisma.knowledgeBaseArticle.update({
      where: { id: articleId },
      data: { [field]: { increment: 1 } },
    });
  },

  // Create automation rule
  async createAutomationRule(
    userId: string,
    name: string,
    trigger: string,
    conditions: any,
    actions: any
  ) {
    return prisma.automationRule.create({
      data: {
        userId,
        name,
        trigger,
        conditionsJson: conditions,
        actionsJson: actions,
      },
    });
  },

  // Get automation rules
  async getAutomationRules(userId: string) {
    return prisma.automationRule.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  // Record CSAT response
  async recordCSAT(ticketId: string, userId: string, score: number, comment?: string) {
    return prisma.cSATResponse.create({
      data: {
        ticketId,
        userId,
        score,
        comment,
      },
    });
  },

  // Get CSAT analytics
  async getCSATAnalytics(userId: string) {
    const responses = await prisma.cSATResponse.findMany({
      where: { userId },
    });

    const avgScore = responses.reduce((sum, r) => sum + r.score, 0) / (responses.length || 1);
    const scoreDistribution = {
      1: responses.filter((r) => r.score === 1).length,
      2: responses.filter((r) => r.score === 2).length,
      3: responses.filter((r) => r.score === 3).length,
      4: responses.filter((r) => r.score === 4).length,
      5: responses.filter((r) => r.score === 5).length,
    };

    return {
      totalResponses: responses.length,
      averageScore: avgScore,
      scoreDistribution,
      nps: ((scoreDistribution[5] + scoreDistribution[4]) / responses.length) * 100,
    };
  },
};
