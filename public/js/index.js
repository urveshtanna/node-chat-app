var socket = io();

var btnRequest = jQuery('#button-verify-otp');
var inputOTP = jQuery('#input-otp');
var inputMobile = jQuery('#input-mobile-number');

var snackbarContainer = document.querySelector('#demo-snackbar-example');
//var showSnackbarButton = document.querySelector('#button-verify-otp');

var isRequestOTP = true;

var animating = false;

// document.querySelector(".main").addEventListener("click",function() {
//    animating = true;
//    this.parentElement.classList.add("active");
//    setTimeout(function (){animating = false}, 510);
//   }
// );

// document.querySelector(
//   ".close"
// ).addEventListener(
//   "click",
//   function() {
//     this.parentElement.classList.remove("active", "facebook", "twitter", "google");
//   }
// );

// facebook = document.querySelector(
//   ".facebookbtn"
// )

// facebook.addEventListener(
//   "mouseover",
//   function () {
//     if (!animating)
//       this.parentElement.parentElement.classList.add("facebook");
//   }
// )

// facebook.addEventListener(
//   "mouseout",
//   function () {
//     this.parentElement.parentElement.classList.remove("facebook");
//   }
// );

// twitter = document.querySelector(
//   ".twitterbtn"
// )

// twitter.addEventListener(
//   "mouseover",
//   function () {
//     if (!animating)
//       this.parentElement.parentElement.classList.add("twitter");
//   }
// )

// twitter.addEventListener(
//   "mouseout",
//   function () {
//     this.parentElement.parentElement.classList.remove("twitter");
//   }
// );

// google = document.querySelector(
//   ".googlebtn"
// )

// google.addEventListener(
//   "mouseover",
//   function () {
//     if (!animating)
//       this.parentElement.parentElement.classList.add("google");
//   }
// )

// google.addEventListener(
//   "mouseout",
//   function () {
//     this.parentElement.parentElement.classList.remove("google");
//   }
// );


(function() {
  'use strict';
  btnRequest.on('click',function(){

    if(inputMobile.val().length != 10){
      'use strict';
      var data = {
        message: 'Invalid mobile number',
        timeout: 2500
      };
      snackbarContainer.MaterialSnackbar.showSnackbar(data);
    }else{
      if(isRequestOTP){
            //btnRequest.attr('disabled','disabled').text('Requesting OTP...');
            btnRequest.text('Requesting OTP...');
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
                //btnRequest.removeAttr('disabled').text('Verify OTP');
                btnRequest.text('Verify OTP');
                inputOTP.removeAttr('disabled');
                inputOTP.attr('autofocus');
                isRequestOTP = false;
            });
          }else{
            //btnRequest.attr('disabled','disabled').text('Validating OTP...');
            btnRequest.text('Validating OTP...');
            inputOTP.attr('disabled','disabled');
            inputMobile.attr('disabled','disabled');
            socket.emit('validateOTP',inputMobile.val(),inputOTP.val(),function(serverMessage,error){
                if(error){
                  inputOTP.removeAttr('disabled');
                  inputMobile.removeAttr('disabled');
                  inputOTP.attr('autofocus','autofocus');
                  //btnRequest.removeAttr('disabled').text('Retry Verify OTP');
                  btnRequest.text('Retry Verify OTP');
                  if(error.statusCode == 400){
                    return alert('Invalid OTP');
                  }
                  return alert(error.statusCode);
                }

                window.location.href = `./chat.html?${serverMessage}`
                btnRequest.text('Verifed');
            });
          }
    }
  });
}());
