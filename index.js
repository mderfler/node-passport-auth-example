const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const secrets = require('./secrets');
const cors = require('cors');

mongoose.connect('mongodb://' + secrets[0] + ':' + secrets[1] + secrets[2]);//user/password/address
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function call(){
	console.log("connected to mlab");
})
//App
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({type: '*/*'}));
router(app);

//Server
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('server listening on: ', port);