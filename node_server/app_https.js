const express = require("express");
const app = express();
let cookie_parser = require("cookie-parser");


app.use(cookie_parser());
app.use('/', (req, res, next) => {
    console.log(`${req.method} ${req.originalUrl} ${JSON.stringify(req.cookies)}`);
    next();
});

app.get('/', (req, res) => {
    res.cookie('name','this_is_secret_cookie').send({message: "Hello, this is cookie setter server"})
});

app.get('/clear', (req, res) => {
    res.clearCookie('name').send({message: "Cookie cleared"})
});

const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(3000);