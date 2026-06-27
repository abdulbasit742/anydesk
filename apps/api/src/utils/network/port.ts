import net from "net";
export const isPortAvailable = (port: number, host: string = "127.0.0.1"): Promise<boolean> => new Promise((resolve) => { const server = net.createServer(); server.once("error", () => resolve(false)); server.once("listening", () => { server.close(); resolve(true); }); server.listen(port, host); });
export const findAvailablePort = async (startPort: number = 3000, endPort: number = 65535): Promise<number> => { for (let port = startPort; port <= endPort; port++) { if (await isPortAvailable(port)) return port; } throw new Error("No available port found"); };
