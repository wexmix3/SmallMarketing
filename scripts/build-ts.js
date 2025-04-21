/**
 * TypeScript Build Script
 * 
 * This script compiles the TypeScript files for use in scripts
 * that need to run outside of Next.js.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Create tsconfig for scripts
const tsconfig = {
  compilerOptions: {
    target: "es2018",
    module: "commonjs",
    moduleResolution: "node",
    esModuleInterop: true,
    outDir: "./dist",
    strict: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    resolveJsonModule: true
  },
  include: ["src/**/*.ts"],
  exclude: ["node_modules", ".next"]
};

// Write tsconfig.scripts.json
fs.writeFileSync(
  path.join(__dirname, '../tsconfig.scripts.json'),
  JSON.stringify(tsconfig, null, 2)
);

// Run TypeScript compiler
try {
  console.log('Compiling TypeScript files...');
  execSync('npx tsc -p tsconfig.scripts.json', { stdio: 'inherit' });
  console.log('TypeScript compilation completed successfully');
} catch (error) {
  console.error('TypeScript compilation failed:', error);
  process.exit(1);
}
