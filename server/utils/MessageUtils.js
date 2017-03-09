var ADMIN_NAME = 'Admin';
var WELCOME_MESSAGE = 'Welcome to the chat app';
var NEW_USER_MESSAGE = 'New User is added to the app';
var generateMessage = (from,body)=>{
  return {
    from,
    body,
    createdAt : new Date().getTime()
  }
}

module.exports = {
  ADMIN_NAME,
  WELCOME_MESSAGE,
  NEW_USER_MESSAGE,
  generateMessage
};
