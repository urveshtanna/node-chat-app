var ADMIN_NAME = 'Truce Care';
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

var order = function (address_uid,created_at,delivery_date,description,description,order_id,status,status_code){
  address_uid,
  created_at,
  delivery_date,
  description,
  order_id,
  status,
  status_code
};

var generateOrderMessage = (from,total_count,order)=>{
  return {
    from,
    total_count,
    order,
    createdAt : moment().valueOf()
  }
}

module.exports = {
  ADMIN_NAME,
  WELCOME_MESSAGE,
  NEW_USER_MESSAGE,
  order,
  generateMessage,
  generateLocationMessage,
  generateOrderMessage
};
