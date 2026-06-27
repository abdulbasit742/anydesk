import { prisma } from "../../lib/prisma.js";
export const dnsService = {
  async createRecord(networkId: string, record: { name: string; type: "A" | "AAAA" | "CNAME" | "MX" | "TXT"; value: string; ttl?: number }) {
    return prisma.dnsRecord.create({ data: { networkId, name: record.name, type: record.type, value: record.value, ttl: record.ttl || 300 } });
  },
  async getRecords(networkId: string) { return prisma.dnsRecord.findMany({ where: { networkId } }); },
  async updateRecord(recordId: string, value: string) { return prisma.dnsRecord.update({ where: { id: recordId }, data: { value } }); },
  async deleteRecord(recordId: string) { return prisma.dnsRecord.delete({ where: { id: recordId } }); },
  async resolve(name: string, networkId: string): Promise<string | null> {
    const record = await prisma.dnsRecord.findFirst({ where: { networkId, name } });
    return record?.value || null;
  },
};
