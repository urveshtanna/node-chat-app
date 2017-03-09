const path = require('path');
const PUBLIC_PATH = path.join(__dirname,'../public');
const express = require('express');
const port = process.env.PORT || 3000;
const http = require('http');
const socket = require('socket.io');
const messageUtils = require('./utils/MessageUtils');

console.log(PUBLIC_PATH);

var app = express();
var server = http.createServer(app);
var io = socket(server);

io.on('connection',(socket)=>{
  console.log('New User is now connect ');


  //socket.emit from admin text welcomes new user app
  socket.emit('newMessage', messageUtils.generateMessage(messageUtils.ADMIN_NAME,messageUtils.WELCOME_MESSAGE));

  //socket.broadcast.emit to exist one saying new user is Connected
  socket.broadcast.emit('newMessage',messageUtils.generateMessage(messageUtils.ADMIN_NAME,messageUtils.NEW_USER_MESSAGE));

  //to listen on this event sent from index.js ie from web page to server
  socket.on('createMessage',(newMessage,callback)=>{

    console.log('created new message',newMessage);
    io.emit('newMessage',messageUtils.generateMessage(newMessage.from ,newMessage.body));

    callback('Received on server');
    //To send message to other user not the current user
    // socket.broadcast.emit('newMessage',{
    //   from : newMessage.from,
    //   body : newMessage.body,
    //   createAt : new Date().getTime()
    // });
  });

  socket.on('disconnect',()=>{
      console.log('User is disconnected');
  });
});



app.use(express.static(PUBLIC_PATH));


server.listen(port,()=>{
    console.log(`Server is up on port ${port}`);
});
