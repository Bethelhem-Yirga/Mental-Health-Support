const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');

if (fs.existsSync(logDir)) {
  const files = fs.readdirSync(logDir);
  files.forEach(file => {
    fs.unlinkSync(path.join(logDir, file));
    console.log(`Deleted: ${file}`);
  });
  console.log('\n✅ All logs cleared!');
} else {
  console.log('No logs directory found');
}
