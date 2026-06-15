import { z } from 'zod';

export const FileArtifactSchema = z.object({
  path: z.string().min(1).describe('Relative path to the generated file.'),
  description: z.string().optional().describe('Brief description of the file content.'),
  type: z.enum(['code', 'documentation', 'configuration', 'test', 'ui', 'other']).describe('Type of the file artifact.'),
  domain: z.string().optional().describe('The domain this file belongs to (e.g., DLP, SSO).'),
});

export const ManifestSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the manifest.'),
  batchId: z.string().min(1).describe('Identifier for the batch of files generated.'),
  generationDate: z.string().datetime().describe('Timestamp when the manifest was generated.'),
  totalFiles: z.number().int().min(0).describe('Total number of files in this batch.'),
  files: z.array(FileArtifactSchema).describe('List of generated file artifacts.'),
  summary: z.string().optional().describe('Overall summary of the generated batch.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the manifest was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the manifest was last updated.'),
});

export type FileArtifact = z.infer<typeof FileArtifactSchema>;
export type Manifest = z.infer<typeof ManifestSchema>;

export const CreateManifestSchema = ManifestSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreateManifest = z.infer<typeof CreateManifestSchema>;

export const UpdateManifestSchema = ManifestSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdateManifest = z.infer<typeof UpdateManifestSchema>;
