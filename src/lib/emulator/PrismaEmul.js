// PrismaEmul.js — Mock database migrator validating visual postgres schemas
export class PrismaEmul {
  constructor(onLog) {
    this.onLog = onLog || (() => {});
    this.models = [];
    this.migrations = [];
  }

  defineModel(name, fields) {
    this.models.push({ name, fields, createdAt: Date.now() });
    this._log('info', `[Prisma] Model defined: ${name} (${fields.length} fields)`);
    return this;
  }

  async migrate(migrationName = 'init') {
    this._log('system', `[Prisma] Running migration: ${migrationName}`);
    await this._delay(300);

    const issues = this._validateSchema();
    if (issues.length) {
      issues.forEach(i => this._log('warn', `[Prisma] Schema warning: ${i}`));
    }

    await this._delay(400);
    this._log('info', `[Prisma] Generating SQL for ${this.models.length} models...`);
    await this._delay(300);

    const sql = this._generateSQL();
    this._log('info', `[Prisma] SQL generated (${sql.split('\n').length} lines)`);

    await this._delay(200);
    const migration = { name: migrationName, models: this.models.length, ts: Date.now(), sql };
    this.migrations.push(migration);
    this._log('success', `[Prisma] Migration '${migrationName}' applied successfully`);
    return migration;
  }

  _validateSchema() {
    const issues = [];
    for (const model of this.models) {
      if (!model.fields.some(f => f.name === 'id')) issues.push(`${model.name}: missing 'id' field`);
      if (!model.fields.some(f => f.name === 'createdAt')) issues.push(`${model.name}: missing 'createdAt' timestamp`);
    }
    return issues;
  }

  _generateSQL() {
    return this.models.map(m =>
      `CREATE TABLE IF NOT EXISTS "${m.name}" (\n` +
      m.fields.map(f => `  "${f.name}" ${f.type || 'TEXT'}`).join(',\n') +
      '\n);'
    ).join('\n\n');
  }

  _log(level, message) { this.onLog({ level, message, ts: Date.now() }); }
  _delay(ms) { return new Promise(r => setTimeout(r, ms)); }
  getMigrations() { return [...this.migrations]; }
}
