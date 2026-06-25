/**
 * Unified Communications & Contact Center
 * Main router that mounts all sub-modules
 */

import { Router } from 'express';
import ticketRoutes from './tickets/ticket.routes.js';
import omnichannelRoutes from './omnichannel/omnichannel.routes.js';
import voipRoutes from './voip/voip.routes.js';
import chatbotRoutes from './ai-chatbot/chatbot.routes.js';
import kbRoutes from './knowledge-base/kb.routes.js';
import analyticsRoutes from './analytics/analytics.routes.js';
import automationRoutes from './automation/automation.routes.js';
import agentRoutes from './agents/agent.routes.js';
import videoRoutes from './video-conferencing/video.routes.js';
import remoteSupportRoutes from './remote-support/remote-support.routes.js';
import widgetRoutes from './widget/widget.routes.js';
import portalRoutes from './customer-portal/portal.routes.js';
import teamRoutes from './team-collaboration/team.routes.js';
import integrationsRoutes from './integrations/integrations.routes.js';
import whiteLabelRoutes from './white-label/white-label.routes.js';

const router = Router();

// Mount all unified communications routes
router.use('/tickets', ticketRoutes);
router.use('/inbox', omnichannelRoutes);
router.use('/voip', voipRoutes);
router.use('/chatbot', chatbotRoutes);
router.use('/kb', kbRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/automation', automationRoutes);
router.use('/agents', agentRoutes);
router.use('/meetings', videoRoutes);
router.use('/remote-support', remoteSupportRoutes);
router.use('/chat', widgetRoutes);
router.use('/portal', portalRoutes);
router.use('/team', teamRoutes);
router.use('/integrations', integrationsRoutes);
router.use('/white-label', whiteLabelRoutes);

export default router;
