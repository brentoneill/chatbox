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
    //setInterval(cr.renderMessages, 1000);
    //setInterval(cr.renderUsers, 2000);
    //cr.renderUsers();
  },

  initUser: function(){
    if(localStorage.getItem("user")) {
      var userObj = $.parseJSON(localStorage.user)
      $('.logged-user').val(userObj.name);
      $('.splash').addClass('hidden');
      $('.chatbox').removeClass('hidden');
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

    //Event for changing username
    ////removes disabled from the input
    $('.logged').on('dblclick', 'input.logged-user', function(e){
      e.preventDefault();
      $(this).removeAttr('disabled');
    });
    // ////changes user name on enter press
    // $('.logged').bind('keypress', function(e) {
    //   if (e.keyCode == 13) {
    //     console.log("enter fired");
    //     var userObj = $.parseJSON(localStorage.user);
    //     var userName = userObj.name;
    //     console.log(userName);
    //     var userId = $(".userlist .user:contains('"+ userObj.name +"')").data("userid");
    //     console.log(userId);
    //     $.ajax({
    //       url:cr.config.base + '/' + userId,
    //       type:'GET',
    //       success:function(user){
    //         console.log(user);
    //         var editedUser = {
    //           name: $('input.logged-user').val(),
    //           loggedIn: "true",
    //           messages: user.messages
    //         }
    //         userObj.name = $('input.logged-user').val();
    //         localStorage.user = JSON.stringify(userObj)
    //         localStorage.user._id = userId;
    //         cr.editUser(editedUser, userId);
    //       },
    //       error:function(err){
    //         console.log(err);
    //       }
    //     });
    //   }
    // });

    //Event for sending the message
    $('.bot').on('click', '#submitMessage', function(e){
      e.preventDefault();
      var msgContents = $('.user-input input').val();
      console.log(msgContents);
      if(msgContents === "") {
        alert("you must first enter a message...");
      }
      else {
        cr.createMessage();
      }
    });
    $('.bot').bind('keypress', function(e) {
      if(e.keyCode==13){
        e.preventDefault();
        var msgContents = $('.user-input input').val();
        console.log(msgContents);
        if(msgContents === "") {
          alert("you must first enter a message...")
        }
        else {
          cr.createMessage();
        }
      }
    });
    //End sending of message



    /////////
    /////////
    //Login//
    /////////
    /////////
    $('.splash').on('click', '.btn-submit', function(e){
      e.preventDefault();
      if($('.splash input').val() === "") {
        alert('you must choose a username');
      }
      else {
        if(localStorage.getItem("user")) {
          console.log("user is already logged in");
          alert('you are already logged in');
          cr.initUser();
          cr.renderMessages();
          cr.renderUser();
        }
        else {
          var newUserName = $('.splash input').val();
          var newUser = {
            name: newUserName,
            loggedIn: "true",
            messages: [
              message = {
                user: newUserName,
                content: "Hello World!",
                time: Date.now()
              }
            ]
          }
          $.ajax({
            url:cr.config.base,
            type:'GET',
            success: function(users){
              //Adds a user if they are not already in the system
              if(_.isEmpty(_.where(users, {name: newUserName}))) {
                cr.addUser(newUser);
                localStorage.user = JSON.stringify(newUser)
                var userObj = $.parseJSON(localStorage.user);
                $('input.logged-user').val(userObj.name);
                console.log(userObj);
                userObj.loggedIn = "true";
                console.log(userObj.loggedIn);
                cr.initUser();
                cr.renderUsers();
                cr.renderMessages();
              }
              //Logs you in if the username you picked is already in the system
              else {
                alert("There is already a " + newUserName + " in the system.\nYou have been logged in to that user name.");
                var currentUser = _.where(users, {name: newUserName});
                currentUser = currentUser[0];
                localStorage.user = JSON.stringify(currentUser);
                var userObj = $.parseJSON(localStorage.user);
                var loggedInUser = {
                  name: currentUser.name,
                  loggedIn: true,
                  messages: currentUser.messages
                }
                var userId = $(".userlist .user:contains('"+ currentUser.name +"')").data("userid");
                cr.logout(userId, loggedInUser);
                $('input.logged-user').val(userObj.name);
                console.log(userObj);
                userObj.loggedIn = "true";
                console.log(userObj.loggedIn);
                cr.initUser();
                cr.renderUsers();
                cr.renderMessages();
              }
            },
            error:function (data){
              console.log(err);
            }
          });
          //Resetts input, hide/shows the splash and chat screens
          $('.splash input').val("");
          $('div.chatbox').fadeOut(500, function(){
            $(this).removeClass('hidden');
            $('div.splash').addClass('hidden');
          });
        }
      }
    });



    //////////
    //////////
    //logout//
    //////////
    //////////
    $('.container').on('click', '.logout', function(e){
      e.preventDefault();
      if(localStorage.getItem("user") === null){
        alert('cant logout becuase you are not logged in');
      }
      else if(!(localStorage.getItem("user") === null)){
        var user = $.parseJSON(localStorage.user);
        var userName = user.name;
        var userId = $(".userlist .user:contains('"+ userName +"')").data("userid");
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
  },
  /////////////////////////////////////
  ////        END OF EVENTS        ////
  /////////////////////////////////////




  /////////////////////////////////////
  //Set the localUser -- UNDER CONSTRUCTION
  /////////////////////////////////////
  setLocalUser:function() {
    //sets the local user...

  },
  /////////////////////////////////////
  /////////////////////////////////////




  /////////////////////////////////////
  //User login/logout function
  /////////////////////////////////////
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
  /////////////////////////////////////
  /////////////////////////////////////




  /////////////////////////////////////
  //Creates the message
  /////////////////////////////////////
  createMessage:function() {
    var user = $.parseJSON(localStorage.user);
    var userId = $(".userlist .user:contains('"+ user.name +"')").data("userid");
    var userName = user.name;
    //Use ajax GET to grab all current usernames previous messages
    $.ajax({
      url: cr.config.base,
      type:'GET',
      success:function(data){
        var userData = _.where(data, {name: userName}); //Finds user in the server object
        userData = userData[0];                         //Based on local storage user name

        //Count messages to set the messageID which messages
        //Will be sorted by to avoid issues with timezones
        var messages = [];
        _.each(data, function(item, idx, array){
          _.each(item.messages, function(msg, idx, array){
            messages.push(msg);
          });
        });
        var count = messages.length;
        console.log(count);
        var newMessage = {
          user:userName,                            //Creates the actual message
          content: $('.user-input input').val(),    //Object to be added to the
          time: Date.now(),                         //Array of messages attached to the user
          mid: count++
        }
        var oldMessages = userData.messages;
        oldMessages.push(newMessage);               //appends the new message to the array of old messages
        var user = {
          name: userName,         //Creates an updated user object
          loggedIn: "true",       //That now has their latest message
          messages: oldMessages   //Appended to the array of old messages
        }
        cr.sendMessage(userData, userId); //actually sends the message (whole user) to server
        $('.user-input input').val("");
      },
      error:function(err){
        console.log(err);
        $('.user-input input').val("");
      }
    });
  },
  /////////////////////////////////////
  /////////////////////////////////////





  /////////////////////////////////////
  //Adds a user to the server
  /////////////////////////////////////
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
  /////////////////////////////////////
  /////////////////////////////////////




  /////////////////////////////////////
  //Delete user -- used to clear server
  /////////////////////////////////////
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
  /////////////////////////////////////
  /////////////////////////////////////




  /////////////////////////////////////
  //Edit User -- UNDER CONSTRUCTION
  /////////////////////////////////////
  editUser: function(user, userid){
    $.ajax({
      url: cr.config.base + '/' + userid,
      type:'PUT',
      data: user,
      success:function(data){
        console.log(data);
        console.log(user);
        console.log(userid);
      },
      error:function(err){
        console.log(err);
      }
    });
  },
  /////////////////////////////////////
  /////////////////////////////////////




  /////////////////////////////////////
  //Sends Message
  /////////////////////////////////////
  sendMessage:function(user, userid) {
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
  /////////////////////////////////////
  /////////////////////////////////////




  /////////////////////////////////////
  //Renders the list of messages
  /////////////////////////////////////
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
  /////////////////////////////////////
  /////////////////////////////////////




  /////////////////////////////////////
  //Render Users function. Used at page load and set interval
  /////////////////////////////////////
  renderUsers: function(){
    $.ajax({
      url:cr.config.base,
      type:'GET',
      success: function(users){
        var compiled = _.template(templates.user);
        var markup = "";
        users = _.sortBy(users, "loggedIn").reverse(); //puts logged in users at top
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
  /////////////////////////////////////
  /////////////////////////////////////
}

///////////////////////////////////////
///////////////////////////////////////
////    END CHAT ROOM OBJECT      /////
///////////////////////////////////////
///////////////////////////////////////




$(document).ready(function(){
  cr.init();//init the chat room
});
