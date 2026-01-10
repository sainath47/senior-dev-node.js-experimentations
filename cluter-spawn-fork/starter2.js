const express = require('express');
const cluster = require('cluster');
const os = require('os');

const app = express();

function delay(duration) {
  const startTime = Date.now();
  while(Date.now() - startTime < duration) {
    //event loop is blocked...
  }
}

app.get('/', (req, res) => {
  // JSON.stringify({}) => "{}"
  // JSON.parse("{}") => {}
  // [5,1,2,3,4].sort()
  res.send(`Performance example: ${process.pid}`);
});

app.get('/timer', (req, res) => {
  delay(9000);
  res.send(`Ding ding ding! ${process.pid}`);
});

console.log('Running server.js...');
if (cluster.isPrimary) { // isMaster is depricated , replaced by the isPrimary
  console.log('Master has been started...');
  const NUM_WORKERS = os.cpus().length;
  for (let i = 0; i < NUM_WORKERS; i++) {
    cluster.fork(); // starting a worker process
  }
} else {
  console.log('Worker process started.');
  app.listen(3000);
}

/**
 * 
 * 
 same notes , you can find in the pm module
 process manager 2(PM2)
 pm2 tool is based on the cluster module of node, pm2 also provide more additional tools on top of it , like the nodemon restarts the server on the code change similarly, we can write the restart strategies for the clusters,


 pm2 <js_file_name>
 pm2 list
 pm2 ls
 pm2 status

pm2 also support the advance tools on the logs , like storing them in file & on rotate basis , which i struggled to implement , i dont know why.


 */