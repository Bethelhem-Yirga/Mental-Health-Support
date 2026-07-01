const os = require('os');
const mongoose = require('mongoose');

setInterval(async () => {
  console.clear();
  console.log('📊 PERFORMANCE MONITOR');
  console.log('====================\n');
  
  // CPU
  const cpus = os.cpus();
  console.log(`💻 CPU: ${cpus.length} cores`);
  
  // Memory
  const totalMem = os.totalmem() / 1024 / 1024 / 1024;
  const freeMem = os.freemem() / 1024 / 1024 / 1024;
  console.log(`🧠 Memory: ${(totalMem - freeMem).toFixed(2)}GB / ${totalMem.toFixed(2)}GB used`);
  
  // Database
  if (mongoose.connection.readyState === 1) {
    const db = mongoose.connection.db;
    const stats = await db.stats();
    console.log(`🗄️ Database: ${stats.collections} collections, ${stats.objects} documents`);
  }
  
  // Uptime
  const uptime = process.uptime();
  console.log(`⏱️ Uptime: ${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`);
  
}, 5000);
