//function that sets the class of a user if loggenIN
var checkStatus = function(loggedIn) {
  if(loggedIn === "true"){
    return "loggedin";
  }
  else {
    return "loggedout";
  }
}


//Checks whether a message is outgoing or incoming
var checkInOut = function(user) {
  var currentUser = $.parseJSON(localStorage.user);
  if(user==currentUser.name){
    return "outgoing";
  }
  else {
    return "incoming";
  }
}

//Sets the user icon based on whether user is you or another user
var setIcon = function(user) {
  var currentUser = $.parseJSON(localStorage.user);
  if(user == currentUser.name) {
    return "fa fa-star"
  }
  else {
    return "fa fa-user"
  }
}


//Sets the username based on whether the message
//was sent by the user or another user
var checkUser = function(user) {
  var currentUser = $.parseJSON(localStorage.user);
  if(user===currentUser.name){
    return "me"
  }
  else {
    return user;
  }
}

//Formats the date of each chat item
var formatDate = function(date) {
  // var day = moment.unix(date/1000);
  var day = moment(date);
  //86400000 is the length of a day in milliseconds
  day = day.format('LTS');
  // if(day.isBefore(yesterday)) {
  //   day = day.format('LTS');
  // }
  // else {
  //   day = day.fromNow()
  // }
  return day;
}
