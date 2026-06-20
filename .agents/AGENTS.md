# Agent Rules for fervent-planck Workspace

## Command triggers
- **Trigger**: When the user requests next features, says "next", or triggers a goal to write multiple files of code.
- **Behavior**: The agent MUST load and execute the `bulk-code-writer` skill by running:
  ```bash
  node .agents/skills/bulk_code_writer/scripts/generate.js
  ```
  to generate 150 feature and utility files, and then report the results.
