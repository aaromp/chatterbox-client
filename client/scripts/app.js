// YOUR CODE HERE:

var app = {
  init: function(){

  },
  send: function(message){
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  fetch: function(){
    return $.ajax({
      //async: false,
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
       // data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message received');
        renderMessages(data.results);

        return data.results;
      },
      error: function (data) {
        console.error('chatterbox: Failed to receive message');
      }
    });
  },

  clearMessages: function() {
    $('#chats').children().remove();
  },

  addMessage: function(message) {
    // $('#main').append('<div id="chats"></div>');//.attr('id', 'chats');
    if (typeof message.text === 'object') console.log(message.text);
    if (message.text !== undefined) message = message.text.replace(/[<>]|document.[^ ]/g,'');
    // [<>]|document.[^ ]
    $('#chats').append('<p>'+message+'</p>');
  },

  addRoom: function(room){
    $('#roomSelect').append('<option>' + room + '</option>');
  }
};

/* run code */

var renderMessages = function(data) {
  app.clearMessages();
  for (var i = 0; i < data.length; i++) {
    app.addMessage(data[i]);
  }
};


$(document).ready(function(){
  $('.clearButton').click(app.clearMessages);

  setInterval(function(){
    app.fetch();
  }, 2000);
});
