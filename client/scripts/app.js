// YOUR CODE HERE:

$(document).ready(function() {
  
  let $body = $('body');
  let $text;

  $('.get').on('click', function(event) {
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
    
  });


  var message = {
    username: 'shawndrost',
    text: 'trololo',
    roomname: '4chan'
  };

  
});






