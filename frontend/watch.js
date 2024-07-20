const { exec } = require('child_process');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from /app/.env
dotenv.config({ path: path.resolve('/app', '.env') });

// Get the environment variable
const env = process.env.ENV || 'dev'; // Default to 'development' if ENV is not set

console.log(`Environment: ${env}`); // Log the environment to verify it's being read

// Map ENV to Angular configurations
const envConfigMap = {
  prod: 'production',
  stag: 'staging',
  dev: 'development'
};

// Get the corresponding Angular configuration
const angularConfig = envConfigMap[env] || 'development';

// Watch the Angular project with the appropriate configuration
const command = `ng build --watch --configuration ${angularConfig}`;

const watcher = exec(command);

watcher.stdout.on('data', (data) => {
  console.log(data.toString());
});

watcher.stderr.on('data', (data) => {
  console.error(data.toString());
});

watcher.on('exit', (code) => {
  console.log(`Child process exited with code ${code}`);
  process.exit(code);
});

watcher.on('error', (err) => {
  console.error(`Failed to start subprocess: ${err}`);
});
