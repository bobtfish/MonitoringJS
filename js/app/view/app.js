window.AppView = Backbone.View.extend({
    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#todoapp"),

    initialize: function() {
        window.Hosts.bind('add',   this.addOne, this);
        window.Hosts.bind('reset', this.addAll, this);
      /*  window.Hosts.bind('all',   this.render, this);*/
        window.Hosts.fetch();
    },
    addOne: function(host) {
      var view = new HostRow({model: host});
      this.$("#host-list").append(view.render().el);
    },

    addAll: function() {
      Hosts.each(this.addOne);
    },
});

