const path = require('path');
const PUBLIC_PATH = path.join(__dirname,'../public');
const express = require('express');
const port = process.env.PORT || 3000;
const http = require('http');
const socket = require('socket.io');

console.log(PUBLIC_PATH);

var app = express();
var server = http.createServer(app);
var io = socket(server);

io.on('connection',(socket)=>{
  console.log('New User is now connect ');

//to listen on this event sent from index.js ie from web page to server
  socket.on('createMessage',(newMessage)=>{
    console.log('created new message',newMessage);
    io.emit('newMessage',{
      from: newMessage.from,
      body: newMessage.body,
      createAt : new Date().getTime()
    });
  });

  socket.on('disconnect',()=>{
      console.log('User is disconnected');
  });
});



app.use(express.static(PUBLIC_PATH));


server.listen(port,()=>{
    console.log(`Server is up on port ${port}`);
});
