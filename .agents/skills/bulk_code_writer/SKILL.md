---
name: bulk-code-writer
description: Triggers when the user requests 'next' to generate 100-200 files of code
---

# Bulk Code Writer Skill

This skill is activated when the user says "next" or requests bulk generation of files. It instructs the agent to execute a generation script to produce 100-200 files of functional, syntax-valid code in the project.

## How to use

1. When triggered, locate the generator script at `.agents/skills/bulk_code_writer/scripts/generate.js`.
2. Run the script with Node:
   ```bash
   node .agents/skills/bulk_code_writer/scripts/generate.js
   ```
3. Verify that the files were generated under `src/lib/generated/` and `src/components/generated/`.
4. Validate that the application compiles cleanly.
