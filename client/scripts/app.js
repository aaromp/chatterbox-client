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
      data: {
        order: '-createdAt',
        limit: maxNumPosts
      },
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message received');
        app.renderPage(data.results);

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

  addMessage: function(data) {

    var user = data.username;
    var ts = data.updatedAt;
    //console.log(ts);
    var message = data.text;
    var room = data.roomname;

    if (user) {
      user = user.replace(/[<>]|document.[^ ]|\$.[^ ]|\$\(/g,'');
    }

    if (message) {
      message = message.replace(/[<>]|document.[^ ]|\$.[^ ]|\$\(/g,'');
    }


    // [<>]|document.[^ ]|\$.[^ ]|\$\(
    if (room === selected) {
    $('#chats').append('<p class="' + user + '">' + user + ' : ' + message + '</p>');

    }
  },

  addRoom: function(room){
    if (room) {
      room = room.replace(/[<>]|document.[^ ]|\$.[^ ]|\$\(/g,'');
    }

    if (room !== '') $('#roomSelect').append('<option>' + room + '</option>');
  },

  renderPage: function(data) {
    app.clearMessages();

    for (var i = 0; i < data.length; i++) {
      app.addMessage(data[i]);
    }

    var rooms = {};
    $('#roomSelect').children().remove();
    for (var j = 0; j < data.length; j++) {
      rooms[data[j].roomname] = true;
    }

    for (var room in rooms) {
      app.addRoom(room);
    }
    $('#roomSelect').val(selected);
  }
};

/* run code */



var query = window.location.search;
var username = query.slice(query.lastIndexOf('=') + 1);
var maxNumPosts = 25;
var refreshLength = 2000;
var selected = $('#roomSelect').val();

$(document).ready(function(){
  $('.clearButton').click(app.clearMessages);
  $('#roomSelect').change(function() {
    selected = $('#roomSelect').val()
  });
  $('.input').keypress(function(e) {

    if(e.which === 13) {
      var message = {
        username: username,
        text: $(this).val(),
        roomname: selected
      };
      app.send(message);
      $(this).val('');
    }
  });

  setInterval(function(){
    app.fetch();
  }, refreshLength);
});
