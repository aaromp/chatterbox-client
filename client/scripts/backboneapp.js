var App = {
  Models: {},
  Views: {},
  Collections: {},
  // One-off objects ==> App.Router = Backbone.Router.extend({});
};

App.Models.Chat = Backbone.Model.extend({
  urlRoot: 'https://api.parse.com/1/classes/chatterbox',

  initialize: function(data) {
    console.log(data);
    this.set({username: data.username,
              message: data.text,
              room: data.roomname,
              timestamp: data.updatedAt
              });
  }
});

App.Views.Chat = Backbone.View.extend({
  initialize: function() {
    this.render();
  },

  render: function() {
    var template =  '<p>' +
                      '<a href="#" id="'+ this.model.get('username') +'">' +
                        this.model.get('username') +
                      '</a>: ' + this.model.get('message') +
                    '</p>';
    this.$el.html(template);
  }
});

App.Views.Chats = Backbone.View.extend({
  initialize: function(){
    // console.log(this);
    this.collection.on('reset', this.render, this);
    this.render();
  },

  addChat: function(chat) {
    console.log('adding chat')
    var chatView = new App.Views.Chat({model: chat});
    this.$el.prepend(chatView.el);
  },

  addChats: function() {
    // console.log('adding chats')
    console.log(this.collection);
    this.$el.empty();
    // this.collection.forEach(this.addChat, this.models[0].attributes.results);
  },

  render: function() {
    // console.log('rendering')
    this.addChats();
  },

  refresh: function() {

  },

  events: {
    // 'click a': 'friend'
  }
});

App.Collections.Chats = Backbone.Collection.extend({
  model: App.Models.Chat,
  url: 'https://api.parse.com/1/classes/chatterbox',
  initialize: function() {
    this.fetch({
      data: {
        order: '-createdAt',
        limit: 25
      },
      success: function(collection, response) {
        var models = [];
        for (var i = 0; i < response.results.length; i++){
          var model = new App.Models.Chat(response.results[i]);  //.create(response.results[i]);
          models.push(model);
        }

        // console.log(collection.models);
        // _.each(collection.models, function(model) {
        //  console.log(model.toJSON());
        // });

        // // _.each(collection.models, function(model) {
        // //   new App.Views.Chat({ model: model });
        // // });


      },
      error: function(collection, response) {
      }
    });
  }
});

var chatsView;
/* run code */
$(document).ready(function() {
  var chats = new App.Collections.Chats();
  chatsView = new App.Views.Chats({collection: chats});
  // chats.reset();
});
