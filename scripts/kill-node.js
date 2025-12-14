// Script to kill all Node.js processes (Windows compatible)
const { exec } = require('child_process');
const os = require('os');

const isWindows = os.platform() === 'win32';

if (isWindows) {
  exec('taskkill /F /IM node.exe', (error, stdout, stderr) => {
    if (error) {
      console.log('No Node.js processes found or already killed');
    } else {
      console.log('All Node.js processes killed');
      console.log(stdout);
    }
  });
} else {
  exec('pkill -f node', (error, stdout, stderr) => {
    if (error) {
      console.log('No Node.js processes found');
    } else {
      console.log('All Node.js processes killed');
    }
  });
}

