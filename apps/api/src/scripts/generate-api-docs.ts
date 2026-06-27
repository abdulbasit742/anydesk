// API documentation generator
const endpoints = [
  { method: "POST", path: "/auth/register", description: "Register new user" },
  { method: "POST", path: "/auth/login", description: "Login user" },
  { method: "GET", path: "/devices", description: "List all devices" },
  { method: "POST", path: "/devices/register", description: "Register device" },
  { method: "POST", path: "/devices/connect", description: "Initiate connection" },
  { method: "GET", path: "/fleet/groups", description: "List device groups" },
  { method: "POST", path: "/fleet/deploy", description: "Create deployment" },
  { method: "POST", path: "/billing/subscribe", description: "Create subscription" },
  { method: "GET", path: "/billing/invoices", description: "List invoices" },
  { method: "GET", path: "/monitoring/alerts", description: "List alerts" },
  { method: "GET", path: "/analytics/dashboard", description: "Dashboard metrics" },
];
console.log("📄 Generated API documentation for", endpoints.length, "endpoints");
