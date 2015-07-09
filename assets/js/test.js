////
////      _           _   _
////  ___| |__   __ _| |_| |__   _____  __
//// / __| '_ \ / _` | __| '_ \ / _ \ \/ /
////| (__| | | | (_| | |_| |_) | (_) >  <
//// \___|_| |_|\__,_|\__|_.__/ \___/_/\_\
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


  init: function() {
    cr.initStyling();
    cr.initEvents();
    cr.initUser();
    cr.renderUsers();
    cr.renderMessages();
    // setInterval(cr.renderMessages, 1000);
    // setInterval(cr.renderUsers, 2000);
  },

  initUser: function(){
    if(localStorage.getItem("user")) {
      var userObj = $.parseJSON(localStorage.user);
      userObj.loggedIn = "true";
      localStorage.user = JSON.stringify(userObj);
      $('input.logged-user').val(userObj.name);
      console.log("logging in " + userObj.name);
      $('.splash').addClass('hidden');
      $('.chatbox').removeClass('hidden');
      $('.splash input').val("");
    }
    else {
      $('.splash span').text('You are not logged in. Please enter username and click submit.');
    }
    cr.renderMessages;
  },

  initStyling: function() {
    //styling stuff

  },


  initEvents: function() {


    ///////////////////////////////////
    //Edit the user name shit
    //Edit the username that is currently logged in
    ///////////////////////////////////
    $('.logged').on('dblclick', 'input.logged-user', function(e){
      e.preventDefault();
      console.log('event firedd');
      $('input.logged-user').removeAttr('disabled');
      $('.logged').bind('keypress', function(e){
        if(e.keyCode==13){
          console.log('that enter key bruhs');
        //this is where that edit shioooot goes
        }
      });
    });
    ///////////////////////////////////
    ///////////////////////////////////





    ///////////////////////////////////
    //Event for sending the message
    ///////////////////////////////////
    $('.bot').on('click', '#submitMessage', function(e){
      e.preventDefault();
      cr.createMessage();
    });
    $('.bot').bind('keypress', function(e) {
      if(e.keyCode==13){
        e.preventDefault();
        cr.createMessage();
      }
    });
    ///////////////////////////////////
    //End sending of message
    ///////////////////////////////////




    ///////////////////////////////////
    /////////
    //Login//
    /////////
    ///////////////////////////////////
    $('.splash').on('click', '.btn-submit', function(e){
      e.preventDefault();
      //Checks to see if there is already a user in local storage
      if(localStorage.getItem("user")) {
        alert('you are already logged in');
        cr.initUser();
        cr.renderMessages();
      }
      //If not user in local storage, then:
      else {
        //Creates new user
        var newUserName = $('.splash input').val();
        var newUser = {
          name: newUserName,
          loggedIn: "true",
          messages: [
            message = {
              user: newUserName,
              content: "Hello World!",
              time: new Date()
            }
          ]
        }
        //AJAX REQUEST to check if user is already in system
        $.ajax({
          url:cr.config.base,
          type:'GET',
          success: function(users){
            console.log(users);
            //Checks to see if the user is new
            if(_.isEmpty(_.where(users, {name: newUserName}))) {
              cr.createUser(newUser);
              localStorage.user = JSON.stringify(newUser)
              cr.initUser();
              cr.renderMessages();
            }
            //If the user is already in the system:
            else {
              alert("There is already a " + newUserName + " in the system.\nYou have been logged in to that user name.");
              var currentUser = _.where(users, {name: newUserName});
              currentUser = currentUser[0];
              console.log(currentUser);
              localStorage.user = JSON.stringify(currentUser);
              cr.initUser();
              cr.renderMessages();

              //Logs the user in
              var loggedInUser = {
                name: currentUser.name,
                loggedIn: true,
                messages: currentUser.messages
              }
              var userId = $(".userlist .user:contains('"+ currentUser.name +"')").data("userid");
              cr.logout(userId, loggedInUser);
            }
          },
          error:function (data){
            console.log(err);
          }
        });
        //END OF AJAX REQUEST//

      }
      cr.renderUsers();
    });
    ///////////////////////////////////
    ///END LOGIN//
    ///////////////////////////////////





    ///////////////////////////////////
    //////////
    //logout//
    //////////
    ///////////////////////////////////
    $('.container').on('click', '.logout', function(e){
      e.preventDefault();
      if(localStorage.getItem("user") === null){
        alert('cant logout becuase you are not logged in');
      }
      else {
        console.log(localStorage.user);
        var userObj = $.parseJSON(localStorage.user);
        var userId = $(".userlist .user:contains('"+ userObj.name +"')").data("userid");

        $.ajax({
          url:cr.config.base + '/' + userId,
          type:'GET',
          success: function(user){
            console.log(userId);
            var loggedOutUser = {
              name: user.name,
              loggedIn: false,
              messages: user.messages
            }
            console.log(loggedOutUser);
            cr.logout(userId, loggedOutUser);
            cr.renderUsers();
          },
          error:function (data){
            console.log(err);
          }
        });
        localStorage.removeItem("user");
        $('.splash').removeClass('hidden');
        $('.chatbox').addClass('hidden');
      }
    });
    ///////////////////////////////////
    //END LOGOUT
    ///////////////////////////////////



    ///////////////////////////////////
    //delete all users
    ///////////////////////////////////
    $('.container').on('click', '.delete-users', function(e){
      e.preventDefault();
      console.log("deleting users...");
      var listLength = $('.user').length;
      for( var i = 0; i < listLength; i++ ) {
        var thisUser = $('.user').eq(i);
        cr.deleteUser(thisUser.data('userid'));
      }
    });
    ///////////////////////////////////
    //END delete all users
    ///////////////////////////////////
  },




  countMessages:function(){
    //counts messages to use for Message ID when creating
    //a user creating a new message.
  },





  ///////////////////////////////////
  //Create Message - create, send, render
  ///////////////////////////////////
  createMessage:function() {
    console.log('creating message');
    var user = $.parseJSON(localStorage.user);
    var userId = $(".userlist .user:contains('"+ user.name +"')").data("userid");
    console.log(userId);
    var userName = user.name;
    console.log(userName);
    $.ajax({
      url: cr.config.base,
      type:'GET',
      success:function(data){
        userData = _.where(data, {name: userName});
        userData = userData[0];
        console.log(userData);
        var newMessage = {
          user:userName,
          content: $('.user-input input').val(),
          time:new Date()
        }
        var oldMessages = userData.messages;
        oldMessages.push(newMessage);
        console.log(oldMessages);
        var user = {
          name: userName,
          loggedIn: "true",
          messages: oldMessages
        }
        console.log(user);
        cr.sendMessage(userData, userId);
        $('.user-input input').val("");
      },
      error:function(err){
        console.log(err);
        $('.user-input input').val("");
      }
    });
    var messages = user.messages;
  },
  ///////////////////////////////////
  ///////////////////////////////////




  ///////////////////////////////////
  //creates a user by adding to database
  ///////////////////////////////////
  createUser: function(user) {
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
  ///////////////////////////////////
  ///////////////////////////////////





  ///////////////////////////////////
  //Send Message -- called when creating a message
  ///////////////////////////////////
  sendMessage:function(user, userid) {
    console.log('sending message4');
    $.ajax({
      url: cr.config.base + '/' + userid,
      data: user,
      type:'PUT',
      success:function(data){
        console.log(data);
        cr.renderMessages();
        $(".chatlog-wrapper").animate({ scrollTop: $('.chatlog-wrapper')[0].scrollHeight}, 500);
      },
      error:function(err){
        console.log(err);
      }
    })
  },
  ///////////////////////////////////
  ///////////////////////////////////




  ///////////////////////////////////
  //Renders the user list
  ///////////////////////////////////
  renderUsers: function(){
    $.ajax({
      url:cr.config.base,
      type:'GET',
      success: function(users){
        var compiled = _.template(templates.user);
        var markup = "";
        users.forEach(function(item,idx,array){
          markup += compiled(item);
        });
        $('section.userlist').html(markup);
      },
      error:function (data){
        console.log(err);
      }
    });
  },
  ///////////////////////////////////
  ///////////////////////////////////


  ///////////////////////////////////
  //Render messages
  ///////////////////////////////////
  renderMessages: function () {
    console.log('rendering messages!');
    $.ajax({
      url:cr.config.base,
      type:'GET',
      success:function(data) {
        var messages = [];
        _.each(data, function(item, idx, array){
          _.each(item.messages, function(msg, idx, array){
            messages.push(msg);
          });
        });
        var compiled = _.template(templates.message)
        var markup = "";
        messages = _.sortBy(messages, "time");
        console.log(messages);
        messages.forEach(function(item,idx,array){
          markup += compiled(item);
        });
        $('.chatlog-wrapper').html(markup);
        $(".chatlog-wrapper").animate({ scrollTop: $('.chatlog-wrapper')[0].scrollHeight}, 500);
      },
      error:function(err) {
        console.log(err);
      }
    });
  },
  ///////////////////////////////////
  ///////////////////////////////////





  ///////////////////////////////////
  //LogIn/Out a user
  ///////////////////////////////////
  logout: function(id, user) {
    $.ajax({
      url: cr.config.base + '/' + id,
      data:user,
      type: 'PUT',
      success: function(data){
        console.log(data);
        cr.renderUsers();
        cr.initUser();
      },
      error: function(err){
        console.log(err);
      }
    })
  },
  ///////////////////////////////////
  ///////////////////////////////////



  ///////////////////////////////////
  //delete all users
  ///////////////////////////////////
  deleteUser: function(id) {
    $.ajax({
      url: cr.config.base,
      type: 'DELETE',
      success: function(data) {
        console.log(data);
        cr.renderUsers();
      },
      error: function(err) {
        console.log(err);
        cr.renderUsers();
      }
    });
  },
  ///////////////////////////////////
  ///////////////////////////////////
}






$(document).ready(function(){
  cr.init();//init the chat room
});
