const { exec } = require('child_process');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from /app/.env
dotenv.config({ path: path.resolve('/app', '.env') });

// Get the environment variable
const env = process.env.ENV || 'dev'; // Default to 'development' if ENV is not set

// Map ENV to Angular configurations
const envConfigMap = {
  prod: 'production',
  stag: 'staging',
  dev: 'development'
};

// Get the corresponding Angular configuration
const angularConfig = envConfigMap[env] || 'development';

// Build the Angular project with the appropriate configuration
exec(`ng build --configuration ${angularConfig}`, (err, stdout, stderr) => {
  if (err) {
    console.error(`Error during build: ${stderr}`);
    process.exit(1);
  }
  console.log(stdout);
});
