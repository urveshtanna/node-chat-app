var ADMIN_NAME = 'Admin';
var WELCOME_MESSAGE = 'Welcome to the chat app';
var NEW_USER_MESSAGE = 'New User is added to the app';
var moment = require('moment');

var generateMessage = (from,body)=>{
  return {
    from,
    body,
    createdAt : moment().valueOf()
  }
}

var generateLocationMessage = (from,latitude,longitude)=>{
  return {
    from,
    url : `https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt : moment().valueOf()
  }
}

module.exports = {
  ADMIN_NAME,
  WELCOME_MESSAGE,
  NEW_USER_MESSAGE,
  generateMessage,
  generateLocationMessage
};
