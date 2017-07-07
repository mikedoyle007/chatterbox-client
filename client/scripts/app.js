// YOUR CODE HERE:

let $body = $('body');  

let App = function () {
  this.etc;
};

let app = new App();

App.prototype.init = function () {
  //
};


App.prototype.send = function (message) {


  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.la.hackreactor.com/chatterbox/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

App.prototype.fetch = function () {
  let $text;

  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.la.hackreactor.com/chatterbox/classes/messages',
    type: 'GET',
    // data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      // debugger;
      $text = data.results[1].text;
      //$('<div class="message"></div>').appendTo($body);
      console.log($text);
      $('<div>' + $text + '</div>').appendTo($body.find('#chats'));
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
  
  
};


$(document).ready(function() {
  
  

  $('.get').on('click', app.fetch());

  
  $('.send').on('click', function() {
    var message = {
      username: 'shawndrost',
      text: 'trololo',
      roomname: '4chan'
    };
  

    app.send(message);
    console.log('sent! ', message);
  });
  
});






