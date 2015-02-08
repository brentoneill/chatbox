///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
////       ChatRoom  application for the Iron Yard     ////
////       By: Brent O'Neill                           ////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////


var cr = {
  //API config to POST, GET data
  config: {
    base: "http://tiy-fee-rest.herokuapp.com/collections/bschatbox"
  },


  init: function(){
    cr.initStyling();
    cr.initEvents();
    //cr.renderMessages();
    //cr.renderUsers();
    //SetInterval to run renderMessages every 200ms
  },


  initStyling: function(){
    //styling stuff
  },


  initEvents: function(){
    //initevents

    //add user
    $('.splash').on('click', '.btn-submit', function(e){
      e.preventDefault();
      if(localStorage.getItem("user")) {
        console.log("user is already logged in");
        alert('you are already logged in');
      }
      else {
        console.log("user not logged in");
        //prompts user to enter a user name
          //show prompt
        //on submit, user gets stored in local storage
        var loggedUser =  $('.splash input').val();
        console.log(loggedUser);
        localStorage.setItem("user", loggedUser);
        var user = {
          name: localStorage.getItem("user"),
          messages: [],
          loggedIn: true
        }
        console.log(user);
        cr.addUser();
      }
    });
  },


  addUser: function(user) {
    $.ajax({
      url: cr.config.base,
      data:user,
      type: 'POST',
      success: function(data) {
        cr.renderUsers();
      },
      error: function(err) {
        console.log(err);
      }
    });
  },


  renderUsers: function(){
    $.ajax({
      url:cr.config.base,
      type:'GET',
      success: function(data){
        var compiled = _.template(templates.user);
        var markup = "";
        messages.forEach(function(item,idx,array){
          markup += compiled(item);
        });
        $('section.userlist').html(markup);
      },
      error:function (data){
        console.log(err);
      }
    }
  }
}

$(document).ready(function(){
  cr.init();//init the chat room
});




// //Chat room object
// var cr = {
//
//   //API config to POST, GET data
//   config: {
//     base: "http://tiy-fee-rest.herokuapp.com/collections/bschatbox"
//   },
//   //Init functions
//   init: function(){
//     cr.initStyling();
//     cr.initEvents();
//     //cr.renderMessages();
//     //SetInterval to run renderMessages every 200ms
//   },
//   //gets the user name
//   getUser: function() {
//     //simply returns the USERid of the current user logged in local storage
//     return localStorage.getItem("user");
//   },
//   addUser: function() {
//     if(localStorage.getItem("user")) {
//       console.log("user is already logged in");
//       alert('you are already logged in');
//     }
//     else {
//       console.log("user not logged in");
//       //prompts user to enter a user name
//         //show prompt
//       //on submit, user gets stored in local storage
//       var loggedUser =  $('.splash input').val();
//       console.log(loggedUser);
//       localStorage.setItem("user", loggedUser);
//       var user = {
//         name: localStorage.getItem("user"),
//         id:01,
//         messages: []
//       }
//       console.log(user);
//       cr.addUser
//     }
//   },
//   initStyling:function(){
//     //IDK what to put here, we'll see....
//   },
//   initEvents:function(){
//
//     $('.container').on('click', '#logout', function(e){
//       e.preventDefault();
//       localStorage.removeItem("user");
//       alert('you have logged out');
//     });
//
//
//
//
//     //Event for user entering login name
//     $('.splash').on('click', '.btn-submit', function(e){
//       e.preventDefault();
//     });
//
//     //Event for user sending message
//     $('.bot').bind('keypress', function(e) {
//       if(e.keyCode==13){
//         cr.sendMessage();
//       }
//     });
//     $('.bot').on('click', 'a.btn-submit', function(e){
//       e.preventDefault()
//       cr.sendMessage();
//     });
//
//     //Delete all users
//     $('.container').on('click', '.delete-users', function(e){
//       e.preventDefault();
//       cr.deleteUsers
//     });
//
//     //TO delete all messages just in case...
//     $('.container').on('click', '.delete-msgs', function(){
//       //delete all messages
//       var listLength = $('.message').length;
//       for( var i = 0; i < listLength; i++ ) {
//         var thisMsg = $('.message').eq(i);
//         cr.deleteMessage(thisMsg.data('msgid'));
//       }
//     });
//     //DELETE ALL MESSAGES//
//   },
//
//   //GET method//
//   renderMessages: function () {
//     $.ajax({
//       url:cr.config.base,
//       type:'GET',
//       success:function(messages) {
//         var compiled = _.template(templates.message)
//         var markup = "";
//         messages = _.sortBy(messages, "time");
//         messages.forEach(function(item,idx,array){
//           markup += compiled(item);
//         });
//         $('section.chatlog').html(markup);
//
//         $(".chatlog-wrapper").animate({ scrollTop: $('.chatlog-wrapper')[0].scrollHeight}, 500);
//       },
//       error:function(err) {
//         console.log(err);
//       }
//     });
//   },
//   renderUsers: function() {
//     $.ajax({
//       url:cr.config.base,
//       type:'GET',
//       success:function(userData) {
//         console.log(userData);
//       },
//       error:function(err) {
//         console.log(err);
//       }
//     });
//   },
//
//
//   //POST methods//
//   addMessage: function(msg) {
//     $.ajax({
//       url: cr.config.base
//       data:msg,
//       type: 'POST',
//       success: function(data) {
//         cr.renderMessages();
//       },
//       error: function(err) {
//         console.log(err);
//       }
//     });
//   },
//
//   createUser: function(user) {
//     $.ajax({
//       url: cr.config.base + ,
//       data:user,
//       type: 'POST',
//       success: function(data) {
//         cr.renderUsers();
//       },
//       error: function(err) {
//         console.log(err);
//       }
//     });
// },
//
//
//
//
//   //DELETE method//
//   deleteMessage: function(id) {
//     $.ajax({
//       url: cr.config.base + '/' + id,
//       type: 'DELETE',
//       success: function(data) {
//         cr.renderMessages();
//       },
//       error: function(err) {
//         console.log(err);
//       }
//     });
//   },
//   deleteUsers: function(id) {
//     $.ajax({
//       url: cr.config.base,
//       type: 'DELETE',
//       success: function(data) {
//         console.log(data);
//       },
//       error: function(err) {
//         console.log(err);
//       }
//     });
//   },
//   //Function for sending of a message
//   sendMessage: function() {
//     var msg = $('.user-input input').val();
//     var time = new Date();
//     var newMessage = {
//       time: time,
//       message: msg,  //takes data from input box
//       user:  $('.logged-user').text()//set user to user currently logged in
//     }
//     console.log(newMessage);
//     if(newMessage.message=="") {
//       //check to user if user has submitted anything
//     }
//     else {
//       //sends POST (addMessage()) on button press or enter pressed
//       //fires renderMessages() inside of addMessage
//       cr.addMessage(newMessage);
//       //Clears input from user input box
//       $('.user-input input').val("");
//     }
//   }
// }
