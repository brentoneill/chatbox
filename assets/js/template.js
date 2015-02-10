var templates = [];


//template for an individual message
templates.message = [
  "<div class='message <% print(checkInOut(user)) %>'>",
    "<span class='user'><% print(checkUser(user)) %></span>",
    "<span class='time'><% print(formatDate(time)) %></span>",
    "<p class='msg'><%= content %></p>",
  "</div>"
].join("");



//template for all the messages in chatlog
templates.user = [
  "<div class='user <% print(checkStatus(loggedIn)) %> <% print(checkUser(name)) %>' data-userid='<%= _id %>'>",
    "<i class='<% print(setIcon(name)) %>'></i> <span><%= name %></span>",
  "</div>"
].join("")
