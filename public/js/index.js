var socket = io();
socket.on('connect',function(){
  console.log('Connected to server');
});

socket.on('disconnect',function(){
  console.log('Disconnected from server');
});

socket.on('newMessage',function(message){
  console.log('New message',message);
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.body}`);
  jQuery('#message-list').append(li);
});

//Testing message
// socket.emit('createMessage',{
//   from : 'Frank',
//   body : 'Hello World!'
// },function(serverMessage){
//   console.log(serverMessage);
// });

jQuery('#message-form').on('submit',function(e){
  e.preventDefault();
  socket.emit('createMessage',{
    from : 'User',
    body : jQuery('[name=input-message]').val()
  },function(serverMessage){
    console.log(serverMessage);
  });
});
