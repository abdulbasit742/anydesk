export interface ExportManifestFile {
  path: string;
  contentType: string;
  bytes: number;
  sha256: string;
}

export interface ExportManifest {
  exportId: string;
  subjectId: string;
  createdAt: string;
  files: ExportManifestFile[];
}

export function getExportManifestTotalBytes(manifest: ExportManifest): number {
  return manifest.files.reduce((sum, file) => sum + file.bytes, 0);
}

export function validateExportManifest(manifest: ExportManifest): string[] {
  const errors: string[] = [];
  if (!manifest.exportId) errors.push("missing-export-id");
  if (!manifest.subjectId) errors.push("missing-subject-id");
  if (manifest.files.some((file) => file.bytes < 0)) errors.push("negative-file-size");
  if (new Set(manifest.files.map((file) => file.path)).size !== manifest.files.length) errors.push("duplicate-file-path");
  return errors;
}
