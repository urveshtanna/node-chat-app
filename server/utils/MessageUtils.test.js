var expect  = require('expect');
var {generateMessage} = require('./MessageUtils');

describe('generateMessage',()=>{
  if('Should generate Message',()=>{
    var from = 'Urvesh';
    var body = 'Test Message';
    var message  = generateMessage(from,body);
    expect(message.createAt).toBeA('number');
    expect(message).toInclude({from,body});
  });
});
