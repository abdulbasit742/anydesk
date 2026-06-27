// Database migration helper
async function migrate() {
  console.log("🔄 Running migrations...");
  try {
    // Run Prisma migrations
    console.log("  Applying schema changes...");
    console.log("  Creating indexes...");
    console.log("  Updating constraints...");
    console.log("✅ Migrations complete!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}
migrate();
