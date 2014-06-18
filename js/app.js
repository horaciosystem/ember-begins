App = Ember.Application.create();

App.Router.map(function() {
  
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return Ember.$.getJSON('http://localhost:3000/polls.json');
  },

  actions: {
    selectItem: function(poll){
    	this.selectedItem = poll;
    },

    doVote: function() {
    	var poll = this.selectedItem;
      if(!poll) return alert('Selecione uma opção!')

      Ember.$.ajax({method: 'PUT', url: 'http://localhost:3000/polls/' + poll.id + '/vote', headers: { 'Content-type': 'application/json'}})
    	.success(function(polls, status, headers, config) {
          model = polls;  
          alert('Obrigado por votar!');
      })
      .error(function(data, status, headers, config) {
          alert('Ops :( Houve um erro durante a votação! Tente mais tarde.');
      });   
    }
  }
});



