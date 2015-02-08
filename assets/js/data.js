//function that sets the class of a user if loggenIN
var checkStatus = function(loggedIn) {
  if(loggedIn === "true"){
    return "loggedin";
  }
  else {
    return "loggedout";
  }
}

var checkInOut = function(user) {
  var currentUser = $.parseJSON(localStorage.user);
  if(user==currentUser.name){
    return "outgoing";
  }
  else {
    return "incoming";
  }
}

var checkUser = function(user) {
  var currentUser = $.parseJSON(localStorage.user);
  if(user===currentUser.name){
    return "me"
  }
  else {
    return user;
  }
}
