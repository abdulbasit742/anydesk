// RemoteDesk Azure Bicep Template
param location string = resourceGroup().location
param dbPassword string

resource containerAppEnv 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: 'remotedesk-env'
  location: location
  properties: {}
}

resource postgres 'Microsoft.DBforPostgreSQL/flexibleServers@2023-03-01-preview' = {
  name: 'remotedesk-db'
  location: location
  sku: { name: 'Standard_D4ds_v4', tier: 'GeneralPurpose' }
  properties: {
    version: '15'
    administratorLogin: 'remotedesk'
    administratorLoginPassword: dbPassword
    storage: { storageSizeGB: 128 }
    backup: { geoRedundantBackup: 'Enabled' }
  }
}

resource redis 'Microsoft.Cache/redis@2023-08-01' = {
  name: 'remotedesk-redis'
  location: location
  properties: {
    sku: { name: 'Standard', family: 'C', capacity: 1 }
  }
}
