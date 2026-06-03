# AgentFlow Companion Extension (Chrome V3 Manifest)

This directory contains Chrome Extension packages that assist AgentFlow in syncing account states and credit usage data.

## Extensions

### 1. `agentflow-helper`
- **Location**: `src/extensions/agentflow-helper/`
- **Manifest Version**: 3
- **Description**: Injects content scripts to watch for credit-exhaustion warnings and relays them directly to the AgentFlow main dashboard event bus to prompt an instant account handoff.
- **Compatible Platforms**: Claude.ai, ChatGPT.com, Gemini.google.com
