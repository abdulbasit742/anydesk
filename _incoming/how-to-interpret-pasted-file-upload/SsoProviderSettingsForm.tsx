import React, { useState } from 'react';
import { z } from 'zod';
import { SamlConfigSchema, OidcConfigSchema } from '@remotedesk/shared/sso';

type SsoProviderType = 'saml' | 'oidc';

interface SsoProviderSettingsFormProps {
  organizationId: string;
  onSave: (config: z.infer<typeof SamlConfigSchema> | z.infer<typeof OidcConfigSchema>, type: SsoProviderType) => void;
  initialConfig?: z.infer<typeof SamlConfigSchema> | z.infer<typeof OidcConfigSchema>;
  initialProviderType?: SsoProviderType;
}

const SsoProviderSettingsForm: React.FC<SsoProviderSettingsFormProps> = ({
  organizationId,
  onSave,
  initialConfig,
  initialProviderType = 'saml',
}) => {
  const [providerType, setProviderType] = useState<SsoProviderType>(initialProviderType);
  const [formData, setFormData] = useState<any>(initialConfig || {});
  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    try {
      if (providerType === 'saml') {
        SamlConfigSchema.omit({ id: true, organizationId: true, createdAt: true, updatedAt: true }).parse(formData);
      } else {
        OidcConfigSchema.omit({ id: true, organizationId: true, createdAt: true, updatedAt: true }).parse(formData);
      }
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: any = {};
      error.errors.forEach((err: any) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({ ...formData, organizationId }, providerType);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md shadow-sm">
      <div>
        <label htmlFor="providerType" className="block text-sm font-medium text-gray-700">
          Provider Type
        </label>
        <select
          id="providerType"
          name="providerType"
          value={providerType}
          onChange={(e) => setProviderType(e.target.value as SsoProviderType)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="saml">SAML</option>
          <option value="oidc">OIDC</option>
        </select>
      </div>

      {providerType === 'saml' ? (
        <>
          <h3 className="text-lg font-semibold">SAML Configuration</h3>
          <div>
            <label htmlFor="providerName" className="block text-sm font-medium text-gray-700">Provider Name</label>
            <input type="text" name="providerName" id="providerName" value={formData.providerName || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            {errors.providerName && <p className="mt-1 text-sm text-red-600">{errors.providerName}</p>}
          </div>
          <div>
            <label htmlFor="entryPoint" className="block text-sm font-medium text-gray-700">Entry Point URL</label>
            <input type="url" name="entryPoint" id="entryPoint" value={formData.entryPoint || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            {errors.entryPoint && <p className="mt-1 text-sm text-red-600">{errors.entryPoint}</p>}
          </div>
          <div>
            <label htmlFor="issuer" className="block text-sm font-medium text-gray-700">Issuer</label>
            <input type="text" name="issuer" id="issuer" value={formData.issuer || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            {errors.issuer && <p className="mt-1 text-sm text-red-600">{errors.issuer}</p>}
          </div>
          <div>
            <label htmlFor="certificate" className="block text-sm font-medium text-gray-700">X.509 Certificate</label>
            <textarea name="certificate" id="certificate" value={formData.certificate || ''} onChange={handleChange} rows={5} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
            {errors.certificate && <p className="mt-1 text-sm text-red-600">{errors.certificate}</p>}
          </div>
          <div>
            <label htmlFor="callbackUrl" className="block text-sm font-medium text-gray-700">Callback URL</label>
            <input type="url" name="callbackUrl" id="callbackUrl" value={formData.callbackUrl || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            {errors.callbackUrl && <p className="mt-1 text-sm text-red-600">{errors.callbackUrl}</p>}
          </div>
          <div>
            <label htmlFor="logoutUrl" className="block text-sm font-medium text-gray-700">Logout URL (Optional)</label>
            <input type="url" name="logoutUrl" id="logoutUrl" value={formData.logoutUrl || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            {errors.logoutUrl && <p className="mt-1 text-sm text-red-600">{errors.logoutUrl}</p>}
          </div>
          <div className="flex items-center">
            <input type="checkbox" name="forceAuthn" id="forceAuthn" checked={formData.forceAuthn || false} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
            <label htmlFor="forceAuthn" className="ml-2 block text-sm text-gray-900">Force Re-authentication</label>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold">OIDC Configuration</h3>
          <div>
            <label htmlFor="oidcProviderName" className="block text-sm font-medium text-gray-700">Provider Name</label>
            <input type="text" name="providerName" id="oidcProviderName" value={formData.providerName || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            {errors.providerName && <p className="mt-1 text-sm text-red-600">{errors.providerName}</p>}
          </div>
          <div>
            <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">Client ID</label>
            <input type="text" name="clientId" id="clientId" value={formData.clientId || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            {errors.clientId && <p className="mt-1 text-sm text-red-600">{errors.clientId}</p>}
          </div>
          <div>
            <label htmlFor="clientSecret" className="block text-sm font-medium text-gray-700">Client Secret</label>
            <input type="password" name="clientSecret" id="clientSecret" value={formData.clientSecret || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            {errors.clientSecret && <p className="mt-1 text-sm text-red-600">{errors.clientSecret}</p>}
          </div>
          <div>
            <label htmlFor="issuer" className="block text-sm font-medium text-gray-700">Issuer URL</label>
            <input type="url" name="issuer" id="issuer" value={formData.issuer || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            {errors.issuer && <p className="mt-1 text-sm text-red-600">{errors.issuer}</p>}
          </div>
          <div>
            <label htmlFor="redirectUrl" className="block text-sm font-medium text-gray-700">Redirect URL</label>
            <input type="url" name="redirectUrl" id="redirectUrl" value={formData.redirectUrl || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            {errors.redirectUrl && <p className="mt-1 text-sm text-red-600">{errors.redirectUrl}</p>}
          </div>
          <div>
            <label htmlFor="scope" className="block text-sm font-medium text-gray-700">Scope</label>
            <input type="text" name="scope" id="scope" value={formData.scope || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            {errors.scope && <p className="mt-1 text-sm text-red-600">{errors.scope}</p>}
          </div>
        </>
      )}

      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Save SSO Configuration
      </button>
    </form>
  );
};

export default SsoProviderSettingsForm;
