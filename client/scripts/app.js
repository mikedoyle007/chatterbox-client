// YOUR CODE HERE:

let $body = $('body');  

let App = function () {
  this.username = window.location.search.slice(10);
  this.currentRoom = $('#currentRoomName').html();
  this.server = 'http://parse.la.hackreactor.com/chatterbox/classes/messages';
  // this.server = 'http://parse.la.hackreactor.com/chatterbox/classes/[this.currentRoom]' will let you retrieve all messages to a room;
  // this.server = 'http://parse.la.hackreactor.com/chatterbox/classes/[this.username]' will let you retrieve all of a user's posts;

};

let app = new App();

App.prototype.init = function () {
  app.fetch();
  
};

App.prototype.send = function (message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      console.log(data);
      let storage = [];
      storage.push(data);
      app.renderMessage(app.username, $('#messageBox').val(), $('#currentRoomName').html());
      return storage;
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

App.prototype.fetch = function () {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'GET',
    data: {order: '-createdAt'}, // gets the newest messages first
    // data: JSON.stringify(message),
    // contentType: 'application/json',
    success: function (data) {
      console.log('success!');
      console.log(data);
      // let user = data.results[0];
      for (var i = 0; i < data.results.length; i++) {
        let user = data.results[i];
        app.renderMessage(user.username, user.text, user.roomname);
      }
      // let user = data.results;
      // console.log(user);
      // app.renderMessage(user.username, user.text, user.roomname);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
  
};


App.prototype.clearMessages = function() {
  $('#chats').children().remove();
};

App.prototype.renderMessage = function(username, messagetext, chatroom) {


  let message = {
    username: username,
    text: messagetext,
    roomname: chatroom
  };

  if ((message.text.indexOf('<') >= 0) || (message.text.indexOf('>') >= 0)) {
    console.log('blocked');
    message.text = 'BLOCKED';
  }

  let $body = $('body'); 
  $('<div>' + message.username + '</div>').appendTo($body.find('#messageContainer'));
  $('<div>' + message.text + '</div><br>').appendTo($body.find('#messageContainer'));
  console.log(message);
};

App.prototype.renderRoom = function () {
  app.clearMessages();
  let chatroom = $('#goToRoomBox').val();
  $('<div class="chatroom" id="' + chatroom + '"><div class="chats" id="' + chatroom + '"></div></div>').appendTo($('#roomSelect'));
  $('h2').html(chatroom);
  
};


$(document).ready(function() {
  
  app.init();

  $('.get').on('click', app.fetch);
  $('.clear').on('click', app.clearMessages);
  $('.add-room').on('click', app.renderRoom);

  $('#goToRoomBox').keypress(function(event) {
    if (event.which === 13) {
      app.renderRoom();
    }
  });
  
  $('.send').on('click', function() {
    var message = {
      username: app.username,
      text: $('#messageBox').val(),
      roomname: $('#currentRoomName').html()
    };

    app.send(message);
    // $('#messageBox').val('');
    //console.log('sent! ', message);
  });

  $('#messageBox').keypress(function(event) {
    if (event.which === 13) {
      var message = {
        username: app.username,
        text: $('#messageBox').val(),
        roomname: $('#currentRoomName').html()
      };

      app.send(message);
      // $('#messageBox').val('');
    }
  });
});


// 
// Things to add:
//
// clear text after hitting enter on text boxes for send message and goto room
// filter messages based on room
// live update of page (AJAX/Jquery)
// add menu/dropdown for rooms
// add friend list (and bolding of friend messages)
// add timestamp of messages
// css
//


