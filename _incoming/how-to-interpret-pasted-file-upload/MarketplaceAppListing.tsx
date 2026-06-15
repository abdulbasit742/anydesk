import React from 'react';
import { MarketplaceApp } from '@remotedesk/shared/marketplace/marketplace-app-dtos';

interface MarketplaceAppListingProps {
  app: MarketplaceApp;
  onInstall?: (appId: string) => void;
  onUninstall?: (appId: string) => void;
}

const MarketplaceAppListing: React.FC<MarketplaceAppListingProps> = ({ app, onInstall, onUninstall }) => {
  const isInstalled = false; // This would come from a state management or API call

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col">
      <div className="flex items-center mb-4">
        {app.logoUrl && (
          <img src={app.logoUrl} alt={`${app.name} logo`} className="w-12 h-12 rounded-md mr-4" />
        )}
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{app.name}</h3>
          <p className="text-sm text-gray-500">{app.vendorId}</p>
        </div>
      </div>
      <p className="text-gray-700 mb-4 flex-grow">{app.shortDescription || app.description}</p>
      <div className="flex justify-between items-center mt-auto">
        <div>
          {app.averageRating && (
            <span className="text-yellow-500 text-sm">
              {'★'.repeat(Math.round(app.averageRating))} ({app.totalReviews})
            </span>
          )}
          <span className="ml-2 text-sm text-gray-600">{app.category}</span>
        </div>
        <div>
          {app.pricingModel === 'free' ? (
            <span className="text-green-600 font-medium">Free</span>
          ) : app.pricingModel === 'subscription' ? (
            <span className="text-gray-800 font-medium">{app.price ? `$${app.price}/${app.currency}` : 'Subscription'}</span>
          ) : (
            <span className="text-gray-800 font-medium">{app.pricingModel}</span>
          )}
        </div>
      </div>
      <div className="mt-4">
        {isInstalled ? (
          <button
            onClick={() => onUninstall && onUninstall(app.id)}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Uninstall
          </button>
        ) : (
          <button
            onClick={() => onInstall && onInstall(app.id)}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Install
          </button>
        )}
      </div>
    </div>
  );
};

export default MarketplaceAppListing;
