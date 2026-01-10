/**
 same notes , you can find in the pm module
 process manager 2(PM2)
 pm2 tool is based on the cluster module of node, pm2 also provide more additional tools on top of it , like the nodemon restarts the server on the code change similarly, we can write the restart strategies for the clusters,


 pm2 <js_file_name>
 pm2 list
 pm2 ls
 pm2 status
 pm2 start <js_file_name> max/2/4/5/6
 pm2 restart 
 pm2 logs 
 pm2 logs --lines 200
 pm2 reload (similar to restart but restarts worker process one by one)


pm2 also support the advance tools on the logs , like storing them in file & on rotate basis , 
pm2 offer a feature like zero down time , like if you want to deploy your changes , the pm2 enables the changes to be deployed in the form of chain, like one after other the changes will be deployed , such that atleast one of the worker process will be active as the deployment is going 

so instead of using the "pm2 restart" 
we can use "pm2 reload", to restart the worker process one by one

which make the application 100%available
100%reliable


but the 
DISADVANTAGES are
in memory cache, like if you stored something in cache of server, that will be varying in various worker processes
(so for this , what do we have to do as a solution is , we have to eliminated storing cache in server & storing somewhere outside of server, redis , DB)


WORKER THREADS

const worker = require('worker')
it enables to make the js excecute in the worker thread

v8 isolates is the feature of the v8 engine
v8 isolates are isolated instances of v8 engine

v8 isolates are like sandboxes but run js code independently of each other.

v8 isolates handle each thread of js execution

just like the cluster module make us utilise the cpu cores similarly is the worker thread module.

so you can totally  compare the cluster module to the worker thread module as they are very similar

master/primary process 
& the copy of the primary 

similarly 
main thread 
copy of them primary worker thread


but 
3 instances of node => 3 process
3 instances of thread => 1 process

& also the cluster exists since the dawn of node.js 
but not same for the worker threads , author says , there is still work going on , on the worker threads
 */

const express = require("express");
// const cluster = require("cluster");
// const os = require("os");

const app = express();

function delay(duration) {
  const startTime = Date.now();
  while (Date.now() - startTime < duration) {
    //event loop is blocked...
  }
}

app.get("/", (req, res) => {
  // JSON.stringify({}) => "{}"
  // JSON.parse("{}") => {}
  // [5,1,2,3,4].sort()
  res.send(`Performance example: ${process.pid}`);
});

app.get("/timer", (req, res) => {
  delay(9000);
  res.send(`Ding ding ding! ${process.pid}`);
});

console.log("Running server.js...");
console.log("Worker process started.");
app.listen(3000);
