var socket = io();
socket.on('connect',function(){
  console.log('Connected to server');

  socket.emit('createMessage',{
    'from':'ubtanna@gmail.com',
    'body':'Creating Email',
    'createAt': ''
  })
});

socket.on('disconnect',function(){
  console.log('Disconnected from server');
})

socket.on('newMessage',function(newMessage){
  console.log('New message',newMessage);
})
