const express = require("express");
const fs = require('fs')
const ws = require('ws')
const https = require('https')
const worker = require('worker_threads')
const app = express();


app.use('/', (req, res, next) => {
    console.log(req.method, req.originalUrl, req.cookies);
    next();
});

// serving webpage
app.get('/', (req, res) => {
    res.writeHead(200, { 'content-type': 'text/html' })
    fs.createReadStream('./spy.html').pipe(res)
});


// creating websocket server for bidirectional communication
const options = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    minVersion: "TLSv1.3",
    maxVersion: "TLSv1.3"
};
const server = https.createServer(options, app);
const ws_server = new ws.WebSocketServer({server});

var ws_end;

ws_server.on('connection', (ws) => {
    ws_end = ws;
    ws.on('message', (data) =>{
        console.log(data.toString());
        ws.send(data.toString()+' : echo from server')
    })
})

// start network eavesdropping
var packet_sniffer = new worker.Worker('./packet_sniffer.js');

packet_sniffer.on('message', (e)=>{
    console.log(e);
    if(ws_end){
        ws_end.send("Hi from sniffer")
    }
})


// starting the server
server.listen(3001, "127.0.0.1", ()=>{
    console.log("server started");
});