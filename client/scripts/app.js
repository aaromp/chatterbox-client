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

    if (room === selectedRoom) {
      $('#chats').append('<p><a href="#" id="'+ user +'">' + user + '</a>: ' + message + '</p>');
    }
  },

  addRoom: function(room){
    if (room) {
      room = room.replace(/[<>]|document.[^ ]|\$.[^ ]|\$\(/g,'');
    }

    if (room !== '') $('#roomSelect').append('<option>' + room + '</option>');
  },

  renderPage: function(data) {
    var rooms = {};
    $('#roomSelect').children().remove();
    for (var j = 0; j < data.length; j++) {
      rooms[data[j].roomname] = true;
    }

    for (var room in rooms) {
      app.addRoom(room);
    }

    $('#roomSelect').val(selectedRoom);
    app.clearMessages();

    for (var i = 0; i < data.length; i++) {
      app.addMessage(data[i]);
    }

    for (var friend in friends) {
      if(friends[friend]) {
        $("#chats #"+friend).toggleClass('friend');
      }
    }
  }
};

/* run code */
//     $("#chats ."+friend).toggleClass('friend');




var query = window.location.search;
var username = query.slice(query.lastIndexOf('=') + 1);
var maxNumPosts = 25;
var refreshLength = 2000;
var selectedRoom = $('#roomSelect').val();
var selectedFriend = $('#friendSelect').val();
var friends = {};

$(document).ready(function(){
  $('.clearButton').click(app.clearMessages);

  $('#roomSelect').change(function() {
    selectedRoom = $('#roomSelect').val();
  });

  $('.input').keypress(function(e) {

    if(e.which === 13) {
      var message = {
        username: username,
        text: $(this).val(),
        roomname: selectedRoom
      };
      app.send(message);
      $(this).val('');
    }
  });
  $(document).on('click', 'a', function() {
    var friend = $(this).attr('id');
    friends[friend] = !friends[friend];
  });

  setInterval(function(){
    app.fetch();
  }, refreshLength);
});
