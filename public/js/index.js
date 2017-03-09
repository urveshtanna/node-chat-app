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
  var inputMessageBox = jQuery('[name=input-message]');
  socket.emit('createMessage',{
    from : 'User',
    body : inputMessageBox.val()
  },function(serverMessage){
    inputMessageBox.val('');
  });
});

var btnLocation = jQuery('#button-send-location');
btnLocation.on('click',function(){
    if(!navigator.geolocation){
      return alert('Geolocation not supported for your browers');
    }
    btnLocation.attr('disabled','disabled').text('Sending Location...');
    navigator.geolocation.getCurrentPosition(function(position){
      btnLocation.removeAttr('disabled').text('Tell My Location');
      console.log(position);
    }, function(error){
      btnLocation.removeAttr('disabled').text('Tell My Location');
      alert(`Unable to fetch your location ${error}`);
    });
});
