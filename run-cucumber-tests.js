#!/usr/bin/env node

const { spawn } = require('child_process');
const { exec } = require('child_process');

let angularServer;
let cucumberProcess;

function startAngularServer() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Starting Angular development server...');
    angularServer = spawn('npm', ['start'], { 
      stdio: 'pipe',
      shell: true 
    });

    angularServer.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(output);
      if (output.includes('compiled successfully') || output.includes('Local:')) {
        console.log('✅ Angular server is ready!\n');
        resolve();
      }
    });

    angularServer.stderr.on('data', (data) => {
      console.log('Angular server:', data.toString());
    });

    angularServer.on('close', (code) => {
      console.log(`Angular server exited with code ${code}`);
    });

    // Timeout after 60 seconds
    setTimeout(() => {
      reject(new Error('Angular server took too long to start'));
    }, 60000);
  });
}

function runCucumberTests() {
  return new Promise((resolve, reject) => {
    console.log('🥒 Starting Cucumber BDD tests...\n');
    
    cucumberProcess = spawn('npx', ['cucumber-js', '--require', 'cucumber.conf.js'], {
      stdio: 'inherit',
      shell: true
    });

    cucumberProcess.on('close', (code) => {
      console.log(`\n🏁 Cucumber tests finished with code ${code}`);
      resolve(code);
    });

    cucumberProcess.on('error', (error) => {
      console.error('Error running Cucumber tests:', error);
      reject(error);
    });
  });
}

function cleanup() {
  console.log('\n🧹 Cleaning up processes...');
  
  if (angularServer) {
    angularServer.kill('SIGTERM');
  }
  
  if (cucumberProcess) {
    cucumberProcess.kill('SIGTERM');
  }
  
  process.exit(0);
}

// Handle cleanup on exit
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);

async function main() {
  try {
    await startAngularServer();
    
    // Wait a bit for the server to fully initialize
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const exitCode = await runCucumberTests();
    
    console.log('\n📊 Test Summary:');
    console.log(exitCode === 0 ? '✅ All Cucumber tests passed!' : '❌ Some Cucumber tests failed!');
    
    cleanup();
    process.exit(exitCode);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    cleanup();
    process.exit(1);
  }
}

main();