/*global bridgelyApp, Backbone*/

// TODO: Setup a 'authenticated' event?

bridgelyApp.Models = bridgelyApp.Models || {};

(function () {
    'use strict';

    bridgelyApp.Models.SessionModel = Backbone.Model.extend({
      defaults: {
        "user_id":  null,
        "name":  null,
        "email": null,
        "auth_token":  null,
        "company":  null
      },
      url: function() {
        return 'http://localhost:3000' + '/v1/auth';
      },
      initialize: function( ) {
        this.storage = localStorage;
        this.load();
      },
      authenticated: function() {
        console.log('Authenticated:', !!this.get('auth_token') )
        return !!this.get('auth_token');
      },
      login: function(email, password) {
        var session = this;
        $.ajax({
          type: 'POST',
          url: this.url()+'/login',
          data: {session: {email: email, password: password}},
          success: function(data) {
            session.save( data.account.id, data.account.name, data.auth_token );
            session.load();
            bridgelyApp.appView.trigger('authenticated');
          },
          error: function() {
            session.trigger('authentication-error');
          }
        });
      },
      logout: function() {
        if (this.authenticated()) {
          var session = this;
          $.ajax({
            type: 'DELETE',
            url: this.url()+'/logout',
            headers: {
              'Authorization' : 'Token token=' + session.get('auth_token')
            },
            success: function() {
              session.destroy();
              bridgelyApp.LoginRouter.navigate('', {trigger: true})
            }
          });
        }
      },
      save: function(user_id, name, auth_token) {
        // Save the auth_token into browser localstorge / cookie
        this.storage.setItem('t', auth_token );
        this.storage.setItem('i', user_id );
        this.storage.setItem('n', name );
      },
      load : function() {
        // Load from browser localstorge / cookie into model
        if (this.storage.length > 0) {
          this.set({
            auth_token: this.storage.getItem('t'),
            user_id: this.storage.getItem('i'),
            name: this.storage.getItem('n')
          });
        } else {
          return;
        }
      },
      destroy: function() {
        this.storage.clear();
        this.set({
          auth_token: null,
          user_id: null,
          name: null
        });
      }
    });

})();