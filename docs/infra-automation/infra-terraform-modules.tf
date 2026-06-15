# Terraform Modules

module 'remotedesk_api' {
  source = './modules/api'
  
  instance_count = 3
  instance_type  = 't3.medium'
  
  database_url = module.database.url
  redis_url    = module.redis.url
}
