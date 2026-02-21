/**
 * Environment Variable Validation
 * Run at application startup to ensure all required env vars are set.
 */

const REQUIRED_VARS = [
  'PORT',
  'MONGODB_URI',
  'ACCESS_TOKEN_SECRET',
  'REFRESH_TOKEN_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

const OPTIONAL_VARS = [
  'NODE_ENV',
  'CORS_ORIGIN',
  'EMAIL_USER',
  'EMAIL_PASS',
  'FRONTEND_URL',
];

export function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error('\nPlease set these in your .env file.');
    process.exit(1);
  }

  const unset = OPTIONAL_VARS.filter((key) => !process.env[key]);
  if (unset.length > 0) {
    console.warn('⚠️  Optional environment variables not set:');
    unset.forEach((key) => console.warn(`   - ${key}`));
  }

  console.log('✅ Environment validation passed');
}
