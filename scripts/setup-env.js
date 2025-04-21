const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envFile = path.join(__dirname, '..', '.env.local');
const envExample = path.join(__dirname, '..', '.env.local.example');

// Check if example file exists
if (!fs.existsSync(envExample)) {
  console.error(`Example file not found: ${envExample}`);
  console.log('Creating default example file...');
  
  const defaultExample = `# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ai_customer_service
DB_USER=postgres
DB_PASSWORD=postgres
DB_SSL=false

# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Feature Flags
LOAD_SAMPLE_DATA=true`;

  fs.writeFileSync(envExample, defaultExample);
  console.log(`Created default example file at ${envExample}`);
}

// Read example file
const exampleContent = fs.readFileSync(envExample, 'utf8');
const envVars = {};

// Extract variables from example
exampleContent.split('\n').forEach(line => {
  if (line.includes('=')) {
    const [key, value] = line.split('=');
    if (!key.startsWith('#')) {
      envVars[key.trim()] = value.trim();
    }
  }
});

// Ask for values
const askForValues = async () => {
  for (const [key, value] of Object.entries(envVars)) {
    await new Promise(resolve => {
      rl.question(`Enter value for ${key} [${value}]: `, (answer) => {
        envVars[key] = answer || value;
        resolve();
      });
    });
  }
  
  // Write to .env.local
  const content = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  fs.writeFileSync(envFile, content);
  console.log(`.env.local file created at ${envFile}`);
  rl.close();
};

// Check if .env.local already exists
if (fs.existsSync(envFile)) {
  rl.question(`.env.local already exists. Overwrite? (y/n): `, (answer) => {
    if (answer.toLowerCase() === 'y') {
      askForValues();
    } else {
      console.log('Operation cancelled.');
      rl.close();
    }
  });
} else {
  askForValues();
}
