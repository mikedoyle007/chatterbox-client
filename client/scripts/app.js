// YOUR CODE HERE:

let $body = $('body');  

let App = function () {
  this.username = 'tempUser';
  this.server = 'http://parse.la.hackreactor.com/chatterbox/classes/messages';
};

let app = new App();

App.prototype.init = function () {
  //
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
      app.renderMessage('tempUser', $('#messageBox').val(), 'HRLA16Room');
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
    // data: JSON.stringify(message),
    // contentType: 'application/json',
    success: function (data) {
      console.log('success!');
      let user = data.results[0];
      app.renderMessage(user.username, user.text, user.roomname);
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
  $('<div>' + message.text + '</div>').appendTo($body.find('#chats'));
};

App.prototype.renderRoom = function () {
  app.clearMessages();
  let chatroom = $('#room-name').val();
  $('<div class="' + chatroom + '"><div class="chats"></div></div>').appendTo($('#roomSelect'));
  //$('<div>hi</div>').appendTo($('#roomSelect'));
  
};


$(document).ready(function() {
  
  

  $('.get').on('click', app.fetch);
  $('.clear').on('click', app.clearMessages);
  $('.add-room').on('click', app.renderRoom);
  
  $('.send').on('click', function() {
    var message = {
      username: 'shawndrost',
      text: $('#messageBox').val(),
      roomname: '4chan'
    };

    app.send(message);
    console.log('sent! ', message);
  });
  
});






