import { z } from 'zod';

export const SdkTargetLanguage = z.enum([
  'typescript',
  'javascript',
  'python',
  'go',
  'csharp',
  'java',
]);

export const SdkGenerationConfigSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the SDK generation configuration.'),
  name: z.string().min(1).describe('Name of the SDK configuration.'),
  description: z.string().optional().describe('Description of the SDK configuration.'),
  sourceApiSpecUrl: z.string().url().describe('URL to the OpenAPI/Swagger specification for the API.'),
  targetLanguage: SdkTargetLanguage.describe('The programming language for which the SDK will be generated.'),
  outputRepositoryUrl: z.string().url().optional().describe('URL of the Git repository where the generated SDK will be pushed.'),
  authenticationMethod: z.enum(['api_key', 'oauth2', 'none']).default('api_key').describe('Authentication method supported by the SDK.'),
  customTemplatesUrl: z.string().url().optional().describe('URL to a repository containing custom templates for SDK generation.'),
  version: z.string().min(1).describe('Version of the SDK to be generated.'),
  maintainer: z.string().email().optional().describe('Email of the maintainer for the generated SDK.'),
  createdAt: z.string().datetime().optional().describe('Timestamp when the configuration was created.'),
  updatedAt: z.string().datetime().optional().describe('Timestamp when the configuration was last updated.'),
});

export type SdkGenerationConfig = z.infer<typeof SdkGenerationConfigSchema>;

export const CreateSdkGenerationConfigSchema = SdkGenerationConfigSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreateSdkGenerationConfig = z.infer<typeof CreateSdkGenerationConfigSchema>;

export const UpdateSdkGenerationConfigSchema = SdkGenerationConfigSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdateSdkGenerationConfig = z.infer<typeof UpdateSdkGenerationConfigSchema>;
