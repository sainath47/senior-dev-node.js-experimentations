const { isMainThread, Worker, workerData } = require("worker_threads");

if (isMainThread) {
  console.log(`Main Thread! Process ID: ${process.pid}`);
  new Worker(__filename,{
    workerData : [7,6,2,3]
  });
  new Worker(__filename,{
    workerData : [1,3,4,3]
  });
} else {
  console.log(`Worker! Process ID: ${process.pid}`);
  // [7,6,2,3].sort()
  console.log(`${workerData} sorted is ${workerData.sort()}`)

}

/**
 from this code above , 
 it is said vaguely that we can execute the sorting in two seperate threads simultainously
 */
