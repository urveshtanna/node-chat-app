var socket = io();

function scrollToBottom(){

  //Selectors
  var messageList = jQuery('#message-list');
  var newMessage = messageList.children('li:last-child');

  var clientHeight = messageList.prop('clientHeight');
  var scrollTop = messageList.prop('scrollTop');
  var scrollHeight = messageList.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
    messageList.scrollTop(scrollHeight);
  }
}

socket.on('connect',function(){
  console.log('Connected to server');
});

socket.on('disconnect',function(){
  console.log('Disconnected from server');
});

socket.on('newMessage',function(message){
  var formatedCreatedAt = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template,{
    body : message.body,
    from : message.from,
    createdAt : formatedCreatedAt
  });

  jQuery('#message-list').append(html);
  scrollToBottom();
  // var li = jQuery('<li></li>');
  // li.text(`${message.from} ${formatedCreatedAt} : ${message.body}`);
  // jQuery('#message-list').append(li);
});

socket.on('newLocationMessage',function(message){
  var formatedCreatedAt = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template,{
    url : message.url,
    from : message.from,
    createdAt : formatedCreatedAt
  });

  jQuery('#message-list').append(html);
  scrollToBottom();
  // var formatedCreatedAt = moment(message.createdAt).format('h:mm a');
  // var li = jQuery('<li></li>');
  // var alink = jQuery('<a target="_blank">I am here</a>')
  // li.text(`${message.from} ${formatedCreatedAt} : `);
  // alink.attr('href',message.url);
  // li.append(alink);
  // jQuery('#message-list').append(li);
});


socket.on('newOrderMessage',function(message){
  console.log(message);
  var formatedCreatedAt = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#order-message-template').html();
  var html = Mustache.render(template,{
    order_id : JSON.parse(JSON.stringify(message.order)).order_id,
    created_on : moment(message.order.created_at).format('DD MMMM YY'),
  });
  jQuery('#message-list').append(html);
  //scrollToBottom();

  // for (var i = 0; i < JSON.parse(JSON.stringify(message.order)).order_details.length; i++) {
  //   var template = jQuery('#order-detail-message-template').html();
  //   var orderDetail = JSON.parse(JSON.stringify(message.order)).order_details[i];
  //   var html = Mustache.render(template,{
  //     product_name : orderDetail.product_name,
  //     quantity : `${orderDetail.ordered_quantity} ${orderDetail.unit_name} `,
  //   });
  //   jQuery('#message-list').append(html);
  // }
  var template = jQuery('#order-detail-message-template').html();
  var orderDetail = JSON.parse(JSON.stringify(message.order)).order_details;
   var html = Mustache.render(template,{
     order_details : orderDetail,
     product_name : orderDetail.product_name,
     quantity : orderDetail.ordered_quantity,
     product_img : orderDetail.product_img_href
   });
   //scrollToBottom();
   jQuery('#message-list').append(html);
   scrollToBottom();
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
