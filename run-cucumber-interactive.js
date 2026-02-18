#!/usr/bin/env node
console.log('🥒 Cucumber BDD Test Runner');
console.log('============================');
console.log('');
console.log('⚠️  IMPORTANT: Make sure the Angular development server is running!');
console.log('');
console.log('If not already running, open a new terminal and execute:');
console.log('  npm start');
console.log('');
console.log('Wait for the "compiled successfully" message, then press any key to continue...');
console.log('');

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', () => {
  console.log('🚀 Starting Cucumber tests...\n');
  
  const { spawn } = require('child_process');
  
  const cucumber = spawn('npx', ['cucumber-js', '--config', 'cucumber.config.js'], {
    stdio: 'inherit',
    shell: true
  });

  cucumber.on('close', (code) => {
    console.log(`\n🏁 Cucumber tests finished with exit code ${code}`);
    process.exit(code);
  });

  cucumber.on('error', (error) => {
    console.error('❌ Error running Cucumber tests:', error);
    process.exit(1);
  });
});