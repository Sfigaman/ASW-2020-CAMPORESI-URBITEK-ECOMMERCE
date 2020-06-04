var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cron = require("node-cron");
var Routes = require(__dirname + "/routes.js");
var mongoose = require('mongoose');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

mongoose.connect('mongodb://localhost/test', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

Routes.setup(app);

io.on('connection', function(socket){
  
  socket.on('message', function(msg){
    io.emit('message', {content: msg});
  });
  
  socket.on('disconnect', function(){});
});

http.listen(3000, function() {
    console.log('Listening on Port 3000');
});
