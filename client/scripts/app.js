// YOUR CODE HERE:

let $body = $('body');  

let App = function () {
  this.username = window.location.search.slice(10);
  this.currentRoom = $('#currentRoomName').html();
  this.server = 'http://parse.la.hackreactor.com/chatterbox/classes/';
  // this.server = 'http://parse.la.hackreactor.com/chatterbox/classes/[this.currentRoom]' will let you retrieve all messages to a room;
  // this.server = 'http://parse.la.hackreactor.com/chatterbox/classes/[this.username]' will let you retrieve all of a user's posts;

};

let app = new App();

App.prototype.init = function () {
  //
};

App.prototype.send = function (message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server + app.currentRoom,
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
    url: app.server + app.currentRoom,
    type: 'GET',
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

  let $body = $('body'); 
  $('<div>' + message.text + '</div>').prependTo($body.find('#chats'));
  console.log(message);
};

App.prototype.renderRoom = function () {
  app.clearMessages();
  let chatroom = $('#goToRoomButton').val();
  $('<div class="chatroom" id="' + chatroom + '"><div class="chats" id="' + chatroom + '"></div></div>').appendTo($('#roomSelect'));
  $('h2').html(chatroom);
  
};


$(document).ready(function() {
  
  $('.get').on('click', app.fetch);
  $('.clear').on('click', app.clearMessages);
  $('.add-room').on('click', app.renderRoom);
  
  $('.send').on('click', function() {
    var message = {
      username: app.username,
      text: $('#messageBox').val(),
      roomname: $('#currentRoomName').html()
    };

    app.send(message);
    //console.log('sent! ', message);
  });
  
});






