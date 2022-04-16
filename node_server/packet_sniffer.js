const {parentPort, workerData} = require("worker_threads");

function f(){
    parentPort.postMessage("next");
    // setTimeout(f, 2000);
}
f()


