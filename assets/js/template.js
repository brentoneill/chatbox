var templates = [];


//template for an individual message
templates.message = [
  "<div class='message <% print(checkInOut(user)) %>'>",
    "<span class='user'><% print(checkUser(user)) %></span>",
    "<span class='time'><%= time %></span>",
    "<p class='msg'><%= content %></p>",
  "</div>"
].join("");



//template for all the messages in chatlog
templates.user = [
  "<div class='user <% print(checkStatus(loggedIn)) %>' data-userid='<%= _id %>'>",
    "<p><%= name %></p>",
  "</div>"
].join("")
