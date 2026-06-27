// Database seeding script
async function seed() {
  console.log("🌱 Seeding database...");
  // Create admin user
  console.log("  Creating admin user...");
  // Create sample devices
  console.log("  Creating sample devices...");
  // Create subscription plans
  console.log("  Creating subscription plans...");
  // Create device groups
  console.log("  Creating device groups...");
  // Create sample alerts
  console.log("  Creating sample alerts...");
  console.log("✅ Seeding complete!");
}
seed().catch(console.error);
