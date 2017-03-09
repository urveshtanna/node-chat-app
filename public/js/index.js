var socket = io();

var btnRequest = jQuery('#button-verify-otp');
var inputOTP = jQuery('#input-otp');
var inputMobile = jQuery('#input-mobile-number');
var isRequestOTP = true;

btnRequest.on('click',function(){
    if(isRequestOTP){
      btnRequest.attr('disabled','disabled').text('Requesting OTP...');
      inputOTP.attr('disabled','disabled');
      inputMobile.attr('disabled','disabled');
      socket.emit('loginUserWithMobileNumber',inputMobile.val(),function(serverMessage,error){
          if(error){
            inputMobile.removeAttr('disabled');
            btnRequest.removeAttr('disabled').text('Request OTP');
            if(error.statusCode == 400){
              return alert('Invalid OTP');
            }
            return alert(error.statusCode);
          }
          btnRequest.removeAttr('disabled').text('Verify OTP');
          inputOTP.removeAttr('disabled');
          inputOTP.attr('autofocus','autofocus');
          isRequestOTP = false;
      });
    }else{
      btnRequest.attr('disabled','disabled').text('Validating OTP...');
      inputOTP.attr('disabled','disabled');
      inputMobile.attr('disabled','disabled');
      socket.emit('validateOTP',inputMobile.val(),inputOTP.val(),function(serverMessage,error){
          if(error){
            inputOTP.removeAttr('disabled');
            inputMobile.removeAttr('disabled');
            inputOTP.attr('autofocus','autofocus');
            btnRequest.removeAttr('disabled').text('Retry Verify OTP');
            if(error.statusCode == 400){
              return alert('Invalid OTP');
            }
            return alert(error.statusCode);
          }

          window.location.href = "./chat.html"
          btnRequest.text('Verifed');
      });
    }

});
