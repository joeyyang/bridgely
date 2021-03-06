/*global bridgelyApp, Backbone*/

bridgelyApp.Routers = bridgelyApp.Routers || {};

(function () {
    'use strict';

    bridgelyApp.Routers.MessageRouter = Backbone.Router.extend({
      requireLogin : function(ifYes) {
        if (bridgelyApp.session.authenticated()) {
          if (_.isFunction(ifYes)) ifYes.call(this);
        } else {
          bridgelyApp.LoginRouter.navigate('login', {trigger: true})
        }
      },
      routes: {
        'message' : 'newMessage',
        'message/:id' : 'viewMessage',
        'message-history' : 'messageHistory'
      },
      newMessage: function() {
        this.requireLogin(function() {
          new bridgelyApp.Views.newMessageView().render();
        })
      },
      viewMessage: function(id) {
        if( id === undefined || !Number(id) ) {
          throw new Error('Route must be called with a valid id');
        } else {
          console.log('View message id: ' + id);
        }
      },
      messageHistory: function() {
        this.requireLogin( function() {
          new bridgelyApp.Views.MessagesView().render();
        });
      }

    });

})();
