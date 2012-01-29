window.AppView = Backbone.View.extend({
    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#todoapp"),

    initialize: function() {
        Hosts.bind('add',   this.addOne, this);
        Hosts.bind('reset', this.addAll, this);
        Hosts.bind('all',   this.render, this);
        Hosts.fetch();
    },
    addOne: function(host) {
      var view = new HostRow({model: host});
      this.$("#host-list").append(view.render().el);
    },

    addAll: function() {
      Hosts.each(this.addOne);
    },
    statsTemplate: _.template($('#stats-template').html()),
    render: function() {
        if (Hosts.has_selected()) {
            $('#hostdetails').html("<pre>" + JSON.stringify(Hosts.selected_host.toJSON(), undefined, 2) + "</pre>");
        }
        $('#hoststats').html(this.statsTemplate({
            total:      Hosts.length,
        }));
    },
});

