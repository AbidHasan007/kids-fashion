// Upload Configuration
// Supabase storage configuration

export const UPLOAD_CONFIG = {
  // API endpoints
  endpoints: {
    supabase: '/api/upload-supabase',
    local: '/api/upload' // Only works in development
  },
  
  // Get the current provider dynamically
  get provider() {
    return process.env.UPLOAD_PROVIDER || 'supabase'
  },
  
  // Get the current upload endpoint
  getUploadEndpoint() {
    return this.endpoints[this.provider] || this.endpoints.supabase
  },
  
  // Check if current provider works on Vercel
  isVercelCompatible() {
    return this.provider !== 'local'
  }
}

// Environment variables needed for each provider
export const REQUIRED_ENV_VARS = {
  supabase: [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ],
  local: [] // No additional env vars needed for local
}

// Get required environment variables for current provider
export function getRequiredEnvVars() {
  return REQUIRED_ENV_VARS[UPLOAD_CONFIG.provider] || []
}

// Validate environment variables
export function validateUploadConfig() {
  // For client-side validation, we'll skip the validation since
  // the actual validation happens on the server-side API
  if (typeof window !== 'undefined') {
    return true
  }
  
  // Server-side validation
  const requiredVars = getRequiredEnvVars()
  const missingVars = requiredVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    console.warn(`Missing environment variables for ${UPLOAD_CONFIG.provider}:`, missingVars)
    return false
  }
  
  return true
}
