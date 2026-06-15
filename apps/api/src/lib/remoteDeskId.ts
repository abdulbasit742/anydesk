import { prisma } from "./prisma.js";

export function formatRemoteDeskId(id: string) {
  return id.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
}

export async function generateRemoteDeskId() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const id = Math.floor(100000000 + Math.random() * 900000000).toString();
    const existing = await prisma.user.findUnique({ where: { remoteDeskId: id } });
    if (!existing) return id;
  }
  throw new Error("Could not generate a unique RemoteDesk ID");
}
