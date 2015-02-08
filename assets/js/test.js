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
    //cr.renderUsers();
    //SetInterval to run renderMessages every 200ms
  },

  initUser: function(){
    if(localStorage.getItem("user")) {
      var userObj = $.parseJSON(localStorage.user)
      $('.logged-user').text(userObj.name);
    }
    else {
      $('.logged-user').text('________');
    }
    cr.renderMessages;
  },

  initStyling: function() {
    //styling stuff

  },


  initEvents: function() {

    //Event for sending the message

    $('.bot').bind('keypress', function(e) {
      if(e.keyCode==13){
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


      }
    });



    /////////
    /////////
    //Login//
    /////////
    /////////

    $('.splash').on('click', '.btn-submit', function(e){
      e.preventDefault();

      if(localStorage.getItem("user")) {
        console.log("user is already logged in");
        alert('you are already logged in');
        cr.initUser();
        cr.renderMessages();
      }

      else {
        console.log("user not logged in");
        //prompts user to enter a user name
          //show prompt
        //on submit, user gets stored in local storage
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
        $.ajax({
          url:cr.config.base,
          type:'GET',
          success: function(users){
            console.log(users);
            if(_.isEmpty(_.where(users, {name: newUserName}))) {
              console.log('true');
              cr.addUser(newUser);
              localStorage.user = JSON.stringify(newUser)
              var userObj = $.parseJSON(localStorage.user)
              $('.logged-user').text(userObj.name);
              cr.renderMessages();
            }
            else {
              console.log('false');
              alert("There is already a " + newUserName + " in the system.\nYou have been logged in to that user name.");
              var currentUser = _.where(users, {name: newUserName});
              currentUser = currentUser[0];
              console.log(currentUser);
              localStorage.user = JSON.stringify(currentUser);
              var userObj = $.parseJSON(localStorage.user);
              var loggedInUser = {
                name: currentUser.name,
                loggedIn: true,
                messages: currentUser.messages
              }
              var userId = $(".userlist .user:contains('"+ currentUser.name +"')").data("userid");
              console.log(loggedInUser);
              console.log(userId);
              cr.logout(userId, loggedInUser);
              $('.logged-user').text(userObj.name);
              cr.renderUsers();
              cr.renderMessages();
            }
          },
          error:function (data){
            console.log(err);
          }
        });
        cr.initUser();
        $('.splash').hide();
        $('.splash input').val("");
      }
      cr.renderUsers();
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


        console.log(localStorage.user);
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
        $('.logged-user').text('_________');
        $('.splash').show();
      }
    });

    //delete all users
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



  logout: function(id, user) {
    $.ajax({
      url: cr.config.base + '/' + id,
      data:user,
      type: 'PUT',
      success: function(data){
        console.log(data);
        cr.renderUsers();
      },
      error: function(err){
        console.log(err);
      }
    })
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

  sendMessage:function(user, userid) {
    console.log(user);
    $.ajax({
      url: cr.config.base + '/' + userid,
      data: user,
      type:'PUT',
      success:function(data){
        console.log(data);
        cr.renderMessages();
      },
      error:function(err){
        console.log(err);
      }
    })
  },

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

}

$(document).ready(function(){
  cr.init();//init the chat room
});
