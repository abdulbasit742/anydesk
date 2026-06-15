# Audit/Forensics: Evidence Export Guide

During a security investigation or for compliance purposes, it may be necessary to export audit logs and other relevant data as evidence. This document provides a guide for securely and effectively exporting evidence from the RemoteDesk system while maintaining its integrity and chain of custody.

## 1. Purpose

The purpose of this guide is to:
*   Ensure that exported evidence is complete, accurate, and relevant to the investigation.
*   Maintain the integrity of the evidence to ensure its admissibility in legal or disciplinary proceedings.
*   Provide a standardized process for evidence collection and export.
*   Protect the privacy of individuals not involved in the investigation.

## 2. Types of Evidence to Export

Evidence can include:
*   **Audit Logs:** Relevant entries from the centralized logging system (refer to `audit-log-structure.md`).
*   **Session Metadata:** Details about remote sessions (participants, duration, timestamps, IDs).
*   **Configuration Snapshots:** Current and historical settings for users, groups, and policies.
*   **System Logs:** Logs from servers, databases, and network devices.
*   **Diagnostic Data:** Information collected via the support diagnostics tool (refer to `support-diagnostics-tool.md`).

## 3. Evidence Export Process

### 3.1. Authorization and Scope

1.  **Obtain Authorization:** Ensure that the evidence collection is properly authorized by legal, HR, or security leadership.
2.  **Define Scope:** Clearly define the scope of the export (e.g., specific users, devices, time frame, event types).

### 3.2. Collection and Extraction

1.  **Use Standard Tools:** Use the built-in export features of the centralized logging system or other official tools.
2.  **Maintain Original Format:** Export data in its original, structured format (e.g., JSON, CSV) whenever possible to facilitate analysis and maintain integrity.
3.  **Include Metadata:** Ensure the export includes all relevant metadata, such as timestamps, source identifiers, and correlation IDs.
4.  **Avoid Modification:** Do not modify, filter, or redact data *during* the extraction process unless specifically required and documented. Any redaction should be performed on a *copy* of the original evidence.

### 3.3. Integrity and Chain of Custody

1.  **Calculate Hashes:** Immediately after extraction, calculate cryptographic hashes (e.g., SHA-256) of the exported files. This provides a verifiable "fingerprint" to detect any subsequent tampering.
2.  **Document Chain of Custody:** Maintain a detailed log of who collected the evidence, when, how, and where it was stored. Every transfer of the evidence should be documented.
3.  **Secure Storage:** Store the exported evidence in a secure, access-controlled location. Use encryption for data at rest.

### 3.4. Redaction and Privacy (Post-Extraction)

1.  **Identify Sensitive Data:** Review the exported evidence for any sensitive information that is not relevant to the investigation or that needs to be protected for privacy reasons.
2.  **Perform Redaction on a Copy:** Always perform redaction on a *copy* of the original, hashed evidence. Keep the original intact.
3.  **Document Redactions:** Clearly document what was redacted and why.

## 4. Export Formats and Delivery

*   **Common Formats:** JSON, CSV, and potentially PDF for summary reports.
*   **Secure Delivery:** Deliver the evidence to the authorized recipients using secure, encrypted channels (e.g., encrypted file transfer, secure cloud storage).
*   **Provide Hash Values:** Include the calculated hash values along with the evidence so the recipients can verify its integrity.

## 5. Record Keeping

Maintain a permanent record of all evidence exports, including:
*   The authorization for the export.
*   The defined scope.
*   The date and time of collection.
*   The person who performed the collection.
*   The hash values of the exported files.
*   The chain of custody documentation.

## 6. Related Documents

*   `audit-log-structure.md`
*   `audit-log-forensic-analysis.md`
*   `audit-log-redaction.md`
*   `support-diagnostics-tool.md`
*   `audit-correlation-guide.md`
