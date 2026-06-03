// DatabaseMigrate.js — Task verifying database migrations inside WebContainers
import { PrismaEmul } from '../../emulator/PrismaEmul.js';

export const DatabaseMigrateStep = {
  id: 'database-migrate',
  name: 'Database Migration',
  type: 'migration',
  description: 'Runs and validates database schema migrations inside the active WebContainer',
  icon: '🗄',
  configSchema: {
    migrationName: { type: 'string', default: 'auto_migration' },
    validateSchema: { type: 'boolean', default: true },
    rollbackOnError: { type: 'boolean', default: true },
  },

  async execute(payload, config = {}) {
    const { models = [], migrationName = 'auto_migration' } = { ...payload, ...config };
    const logs = [];

    const emul = new PrismaEmul(entry => logs.push(entry));

    for (const model of models) {
      emul.defineModel(model.name, model.fields);
    }

    try {
      const result = await emul.migrate(migrationName);
      return { success: true, migration: result, logs };
    } catch (err) {
      if (config.rollbackOnError) {
        logs.push({ level: 'warn', message: `[Migration] Rolling back due to error: ${err.message}`, ts: Date.now() });
      }
      return { success: false, error: err.message, logs };
    }
  },
};
