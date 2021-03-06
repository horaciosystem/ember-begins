App = Ember.Application.create();

App.Router.map(function() {
  
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return Ember.$.getJSON('http://localhost:3000/polls.json');
  }
});

App.IndexController = Ember.ArrayController.extend({
  sumTotalVotes: function() {
    return this.get("model").mapBy("votes").
      reduce(function(totalVotes, value){ return totalVotes + value;});
  }.property("model"),
  chartData: function() {
    var totalVotes = this.get("sumTotalVotes");
    return this.get("model").map(function(poll) {
      var percentualVotes = poll.votes / totalVotes * 100;
      return { label: poll.question, value: percentualVotes };
    });
  }.property("model"),
  currentPartial: "poll_question",
  actions: {
    doVote: function() {
      var controller = this;
      var poll = this.selectedItem;
      if(!poll) return alert('Selecione uma opção!');

      Ember.$.ajax({type: 'PUT', url: 'http://localhost:3000/polls/' + poll.id + '/vote', headers: { 'Content-type': 'application/json'}})
        .success(function(polls, status, xhr) {
          controller.set("model", polls);
          controller.set("currentPartial", "poll_result");
          //alert('Obrigado por votar!');
        })
        .error(function(data, status, xhr) {
          alert('Ops :( Houve um erro durante a votação! Tente mais tarde.');
       });   
    }
  }
});

App.RadioButton = Ember.Component.extend({
    tagName : "input",
    type : "radio",    
    attributeBindings : [ "name", "type", "value", "checked:checked" ],
    click : function() {
        this.set("selection", this.get("value"));
    },
    checked : function() {
        return this.get("value") === this.get("selection");
    }.property('selection')
});

Em.Handlebars.helper('radio-button',App.RadioButton);

Em.Handlebars.registerHelper('json', function(path, options) {
  var obj = Em.Handlebars.get(this, path, options);
  return JSON.stringify(obj);
});