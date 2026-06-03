const fs = require('fs');
const path = require('path');
const readline = require('readline');

const logDir = path.join(__dirname, '../logs');

function viewLogs(type = 'application', lines = 50) {
  const date = new Date().toISOString().split('T')[0];
  const logFile = path.join(logDir, `${type}-${date}.log`);
  
  if (!fs.existsSync(logFile)) {
    console.log(`No logs found for ${type} on ${date}`);
    return;
  }
  
  const rl = readline.createInterface({
    input: fs.createReadStream(logFile),
    output: process.stdout,
    terminal: false
  });
  
  const logLines = [];
  
  rl.on('line', (line) => {
    logLines.push(line);
    if (logLines.length > lines) {
      logLines.shift();
    }
  });
  
  rl.on('close', () => {
    console.log(`\n📋 Last ${logLines.length} logs from ${type}-${date}.log:\n`);
    logLines.forEach(line => {
      try {
        const parsed = JSON.parse(line);
        console.log(`[${parsed.timestamp}] ${parsed.level.toUpperCase()}: ${parsed.message}`);
      } catch {
        console.log(line);
      }
    });
  });
}

// Parse command line arguments
const type = process.argv[2] || 'application';
const lines = parseInt(process.argv[3]) || 50;

viewLogs(type, lines);
