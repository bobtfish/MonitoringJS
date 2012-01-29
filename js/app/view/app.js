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
    hostTemplate: _.template($('#host-detail-template').html()),
    render: function() {
        if (Hosts.has_selected()) {
            $('#hostdetails').html(this.hostTemplate(Hosts.selected_host.toJSON()));
        }
        $('#hoststats').html(this.statsTemplate({
            total:      Hosts.length,
        }));
    },
});

$(function(){
  // Finally, we kick things off by creating the **App**.
  window.App = new AppView;

});
