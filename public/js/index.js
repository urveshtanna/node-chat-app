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

socket.on('newLocationMessage',function(message){
  console.log('New message',message);
  var li = jQuery('<li></li>');
  var alink = jQuery('<a target="_blank">I am here</a>')
  li.text(`${message.from}: `);
  alink.attr('href',message.url);
  li.append(alink);
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

      socket.emit('createLocationMessage',{
        from : 'User',
        latitude : position.coords.latitude,
        longitude : position.coords.longitude
      },function(serverMessage){
        console.log(serverMessage);
      })
      }, function(error){
        btnLocation.removeAttr('disabled').text('Tell My Location');
        alert(`Unable to fetch your location ${error}`);
    });
});
