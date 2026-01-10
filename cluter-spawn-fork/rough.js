const express = require("express");
const app = express();
// const os = require('os')
// const cluster = require("cluster");

app.get("/", (req, res) => {
  console.log("non delay");
  //   return res.send("non-delay hello");
  return res.send(`Performance example ${process.pid} on non-delay api`);
});

app.get("/delay", async (req, res) => {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("not until for 9sec");
    }, 9000);
  }).then((res) => console.log(res));

  return res.send(`Performance example ${process.pid} on delay api`);
});

app.get("/more-delay", async (req, res) => {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("not until for 20sec");
    }, 20000);
  }).then((res) => console.log(res));

  return res.send(`Performance example ${process.pid} on more-more-delay api`);
});

// app.get("/", async (req, res) => {
//   setTimeout(() => {
//     console.log("not until for 9sec");
//   }, 9000);
//   return res.send("i delayed you");
// });

// if (cluster.isMaster) {
//   console.log("Master has been started...");

//   // physical cores
//   //logical cores

//   /**
//    to maximize the performance of our server in general, we want to take the amount of logical cores whic
//    */

//    const NUM_WORKERS = os.cpus().length
//    for(let i=0; i<NUM_WORKERS;i++){
//     cluster.fork();
//    }
//   cluster.fork(); //this command is what makes the worker
//   cluster.fork(); //this command is what makes the worker
//   cluster.fork(); //this command is what makes the worker
//   cluster.fork(); //this command is what makes the worker
//   cluster.fork(); //this command is what makes the worker
//   cluster.fork(); //this command is what makes the worker
// } else {
//     console.log("Worker started. PID:", process.pid);
  app.listen(9090, () => {
    console.log("Listening on 9090 from PID:", process.pid);
  });
// }

// app.listen(9090, () => {
//   console.log("hello listening now at 9090");
// });
