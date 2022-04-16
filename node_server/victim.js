const express = require("express");
const fs = require('fs')
const ws = require('ws')
const https = require('https')
const cookie_parser = require('cookie-parser')
const app = express();

app.use(cookie_parser())
app.use('/', (req, res, next) => {
    console.log(req.method, req.originalUrl, req.cookies);
    next();
});

// set cookie
app.get('/', (req, res) => {
    res.cookie('name', 'This is session id we want to get', {httpOnly: true})
    res.status(200).send("Cookie set successfully")
});


// creating http + websocket server
// Forcing TLS v1.0
const options = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    minVersion: "TLSv1",
    maxVersion: "TLSv1"
};

const server = https.createServer(options, app);
const ws_server = new ws.WebSocketServer({server});

ws_server.on('connection', (ws) => {
    console.log('Got websocket connection');
    ws.on('message', (data) =>{
        console.log(data.toString());
    })
})

// starting the server
server.listen(3000, "127.0.0.1", ()=>{
    console.log("server started");
});