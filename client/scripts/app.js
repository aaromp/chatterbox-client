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
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
       // data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message received');
      },
      error: function (data) {
        console.error('chatterbox: Failed to receive message');
      }
    });
  },

  clearMessages: function() {
    $('#chats').fadeOut();
  },

  addMessage: function(message) {
    $('#main').append('<div id="chats"></div>');//.attr('id', 'chats');
    $('#chats').html('<p>'+message.message+'</p>');
  },

  addRoom: function(room){
    $('#roomSelect').append('<option>' + room + '</option>');
  }
};

$(document).ready(function(){
  $('.clearButton').click(app.clearMessages);
});
