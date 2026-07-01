const cluster = require('cluster');
const os = require('os');
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;
const WORKERS = process.env.WORKERS || os.cpus().length;

if (cluster.isMaster) {
  console.log(`🎯 Master process ${process.pid} running`);
  console.log(`🚀 Forking ${WORKERS} worker processes`);
  
  // Fork workers
  for (let i = 0; i < WORKERS; i++) {
    cluster.fork();
  }
  
  // Handle worker crashes
  cluster.on('exit', (worker, code, signal) => {
    console.log(`⚠️ Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
  
  // Log worker status
  cluster.on('online', (worker) => {
    console.log(`✅ Worker ${worker.process.pid} is online`);
  });
  
} else {
  // Workers share the same database connection
  connectDB().then(() => {
    const server = require('http').createServer(app);
    const { initSocket } = require('./config/socket');
    initSocket(server);
    
    server.listen(PORT, () => {
      console.log(`🚀 Worker ${process.pid} listening on port ${PORT}`);
    });
  });
}
