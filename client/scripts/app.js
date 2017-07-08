// YOUR CODE HERE:

let $body = $('body');  

let App = function () {
  this.username = window.location.search.slice(10);
  this.currentRoom = $('#currentRoomName').html();
  this.server = 'http://parse.la.hackreactor.com/chatterbox/classes/messages';
  this.lastFetched = '2015-07-08T19:18:45.729Z'; // date where last fetch (GET request) was sent. default set to an arbitrary date.
  // this.server = 'http://parse.la.hackreactor.com/chatterbox/classes/[this.currentRoom]' will let you retrieve all messages to a room;
  // this.server = 'http://parse.la.hackreactor.com/chatterbox/classes/[this.username]' will let you retrieve all of a user's posts;

};

let app = new App();

App.prototype.init = function () {
  console.log(app.lastFetched);
  app.fetch();
  window.setInterval(app.fetchAndPrepend, 2000);
  
};

App.prototype.send = function (message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) { // data after a POST request: server will send data back with the message's objectID and CreatedAt
      console.log('chatterbox: Message sent');
      console.log(data);
      let storage = [];
      storage.push(data);
      // app.clearMessages();
      // app.fetch();
      // app.renderMessage(app.username, $('#messageBox').val(), $('#currentRoomName').html());
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
    //  createdAt: '2017-07-08T18:14:31.329Z'}, // fetch to get messages at specific times. (does not work, needs further research)
    // data: JSON.stringify(message),
    // contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: fetch success!');
      //console.log(data);
      let lastQueryTime = new Date(app.lastFetched);
      for (var i = 0; i < data.results.length; i++) {
        let userMessageObject = data.results[i];
        let messageTime = new Date(data.results[i].createdAt);
        // console.log('Last Query minus messageTime: ', lastQueryTime - messageTime);
        if ((lastQueryTime - messageTime) < 0) {
          // console.log(data.results[i].message);
          // console.log(data.results[i].createdAt);
          app.renderMessage(userMessageObject.username, userMessageObject.text, userMessageObject.roomname);
        }
      }
      let now = new Date();
      app.lastFetched = now.toISOString();
      console.log('lastFetched updated to: ' + app.lastFetched);  

    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

App.prototype.fetchAndPrepend = function () {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'GET',
    data: {order: '-createdAt'}, // gets the newest messages first
    //  createdAt: '2017-07-08T18:14:31.329Z'}, // fetch to get messages at specific times. (does not work, needs further research)
    // data: JSON.stringify(message),
    // contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: fetch success!');
      //console.log(data);
      let lastQueryTime = new Date(app.lastFetched);
      for (var i = 0; i < data.results.length; i++) {
        let userMessageObject = data.results[i];
        let messageTime = new Date(data.results[i].createdAt);
        // console.log('Last Query minus messageTime: ', lastQueryTime - messageTime);
        if ((lastQueryTime - messageTime) < 0) {
          // console.log(data.results[i].message);
          // console.log(data.results[i].createdAt);
          app.renderMessagePrepend(userMessageObject.username, userMessageObject.text, userMessageObject.roomname);
        }
      }
      let now = new Date();
      app.lastFetched = now.toISOString();
      console.log('lastFetched updated to: ' + app.lastFetched);  

    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};


App.prototype.clearMessages = function() {
  let $body = $('body');
  $('iframe').contents();
};

App.prototype.renderMessage = function(username, messagetext, chatroom) {

  let message = {
    username: username,
    text: messagetext,
    roomname: chatroom
  };
  
  console.log(message);

  if (message.text === undefined) {
    message.text = 'undefined';
  }

  if ((message.text.indexOf('<') >= 0) || (message.text.indexOf('>') >= 0)) {
    console.log('blocked');
    message.text = 'BLOCKED';
  }

  let $body = $('body'); 
  $('<div>' + message.username + '</div>').appendTo($body.find('#messageContainer'));
  $('<div>' + message.text + '</div><br>').appendTo($body.find('#messageContainer'));
  
};

App.prototype.renderMessagePrepend = function(username, messagetext, chatroom) {

  let message = {
    username: username,
    text: messagetext,
    roomname: chatroom
  };
  
  console.log(message);

  if (message.text === undefined) {
    message.text = 'undefined';
  }

  if ((message.text.indexOf('<') >= 0) || (message.text.indexOf('>') >= 0)) {
    console.log('blocked');
    message.text = 'BLOCKED';
  }

  let $body = $('body'); 
  $('<div>' + message.text + '</div><br>').prependTo($body.find('#messageContainer'));
  $('<div>' + message.username + '</div>').prependTo($body.find('#messageContainer'));

  
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
      $('#goToRoomBox').val('');
    }
  });
  
  $('.send').on('click', function() {
    var message = {
      username: app.username,
      text: $('#messageBox').val(),
      roomname: $('#currentRoomName').html()
    };

    app.send(message);
    $('#messageBox').val('');
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
      $('#messageBox').val('');
    }
  });
});


// 
// Things to add:
//
// clear text after hitting enter on text boxes for send message and goto room // done for sendmessage
// filter messages based on room
// live update of page (AJAX/Jquery) // done using setInterval
// add menu/dropdown for rooms // added iframe, need to implement clicking functionality
// add friend list (and bolding of friend messages) // added iframe, need to implement clicking functionality
// add timestamp of messages
// css
//


