const path = require('path');
const PUBLIC_PATH = path.join(__dirname,'../public');
const express = require('express');
const port = process.env.PORT || 3000;
const http = require('http');
const socket = require('socket.io');
const messageUtils = require('./utils/MessageUtils');
const CONSTANTS = require('./utils/Constants');

var apiai = require('apiai');
var AIapp = apiai("9b6e74eeae7d4cbba0324c1d0aa42479");

console.log(PUBLIC_PATH);

var app = express();
var server = http.createServer(app);
var io = socket(server);
var request = require('request-promise');

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
    var request = AIapp.textRequest(newMessage.body, {
        sessionId: '<unique session id>'
    });
    request.on('response', function(response) {
        io.emit('newMessage',messageUtils.generateMessage(messageUtils.ADMIN_NAME ,response.result.fulfillment.speech));
        checkforAction(io,response.result.action);
    });

    request.on('error', function(error) {
        console.log(error);
        io.emit('newMessage',messageUtils.generateMessage(messageUtils.ADMIN_NAME ,newMessage.body));
    });
    request.end();
    //This is send back once the data is receied on server ie in current file
    callback('Received on server');
  });

  //to listen on this event sent from index.js ie from web page to server
  socket.on('createLocationMessage',(newMessage,callback)=>{
    console.log('created new message',newMessage);
    io.emit('newLocationMessage',messageUtils.generateLocationMessage(newMessage.from ,newMessage.latitude, newMessage.longitude));
    //This is send back once the data is receied on server ie in current file
    callback('Received on server');
  });

  //to listen on this event sent from index.js ie from web page to server
  socket.on('loginUserWithMobileNumber',(mobileNumber,callback)=>{
    console.log('Mobile Number',JSON.stringify(mobileNumber));

    var options = {
        method: 'POST',
        uri: 'http://dev.api.truce.co.in/api/v1/auth/bb/get/verify_otp/',
        body: {
            login_id: mobileNumber
        },
        json: true // Automatically stringifies the body to JSON
    };

    request(options).then(function (response) {
          // Request was successful, use the response object at wil;
          callback('Request Sent');
      })
      .catch(function (err) {
          // Something bad happened, handle the error
            console.log(err);
            callback(undefined,err);
      });
  });

  //to listen on this event sent from index.js ie from web page to server
  socket.on('validateOTP',(mobileNumber,otp,callback)=>{
    console.log('Mobile Number',JSON.stringify(mobileNumber));
    var options = {
        method: 'POST',
        uri: 'http://dev.api.truce.co.in/api/v1/auth/bb/login_or_register/buyer/',
        body: {
          mobile_number : mobileNumber,
          otp : otp
        },
        json: true // Automatically stringifies the body to JSON
    };
    console.log(options);
    request(options).then(function (response) {
          // Request was successful, use the response object at wil;
          callback('Request Sent');
      })
      .catch(function (err) {
          // Something bad happened, handle the error
            callback(undefined,err);
      });
  });

  socket.on('disconnect',()=>{
      console.log('User is disconnected');
  });
});

function checkforAction(io,action){
    switch (action) {
      case "order_status":
      request({
          headers: {
            'X-Auth-Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3VpZCI6ImU4ZjJiOWUyLTFiMzktNDcxZi1iMGY4LTRkZGIwMTUwNDIyNiIsImdyb3VwIjpbMTYsMTVdLCJ1aWQiOjE1MCwiYnV5ZXJfdWlkIjoiNDkxNjUwZmEtZGJlMC00MzI5LWIyNTUtMjMyOWM0YmY2YzFjIiwic2VsbGVyX3VpZCI6IjYxMGIwODViLWRkMGYtNDM5Mi05NGQ0LTU4Zjc5ZDdhNzVkYSIsInRpbWUiOjM0NzQ3NDgwfQ.mHtWdfic7CSeXSaVoK6TAQPeF2_rnOUk0XVkFf8381M',
            json : true
          },
          uri: 'http://dev.api.truce.co.in/api/v1/requirements/app/buy_order/all/?status=open&start=1&limit=10',
          method: 'GET'
        }).then(function (response) {
            // Request was successful, use the response object at wil;
            var total = JSON.parse(response).meta.total_count;
            io.emit('newMessage',messageUtils.generateMessage(messageUtils.ADMIN_NAME ,`You have total ${total} ongoing orders`));
            for (var i = 0; i < JSON.parse(response).payload.orders.length; i++) {
              io.emit('newOrderMessage',messageUtils.generateOrderMessage(messageUtils.ADMIN_NAME ,JSON.parse(response).meta.total_count, JSON.parse(response).payload.orders[i]));
            }

        })
        .catch(function (err) {
            // Something bad happened, handle the error
              console.log(err);
        });
        break;
      default:

    }
}

app.use(express.static(PUBLIC_PATH));


server.listen(port,()=>{
    console.log(`Server is up on port ${port}`);
});
