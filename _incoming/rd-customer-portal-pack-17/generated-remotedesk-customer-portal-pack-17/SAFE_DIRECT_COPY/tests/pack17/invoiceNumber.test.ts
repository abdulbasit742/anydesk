import assert from "node:assert/strict"; import { buildInvoiceNumber } from "../../packages/shared/src/pack17/invoiceNumber.js"; assert.equal(buildInvoiceNumber("rd", 7), "RD-000007");
