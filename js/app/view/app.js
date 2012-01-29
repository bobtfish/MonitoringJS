var AppView = Backbone.View.extend({
    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#todoapp"),

    initialize: function() {
        this.Hosts = new CollectionOfHosts;
        this.Hosts.bind('add',   this.addOne, this);
        this.Hosts.bind('reset', this.addAll, this);
        this.Hosts.bind('all',   this.render, this);
        this.Hosts.bind('host_selected', this.render_one_host, this);
        this.Hosts.fetch();
    },
    addOne: function(host) {
      var view = new HostRow({model: host});
      this.$("#host-list").append(view.render().el);
    },

    addAll: function() {
        this.Hosts.each(this.addOne);
    },
    statsTemplate: _.template($('#stats-template').html()),
    hostTemplate: _.template($('#host-detail-template').html()),
    classListTemplate: _.template($('#class-list-item-template').html()),
    render_one_host: function() {
        $('#hostdetails').html(this.hostTemplate({host: this.Hosts.selected_host}))
    },
    render: function() {
        $('#hoststats').html(this.statsTemplate({
            total:      this.Hosts.length,
            total_classes: this.Hosts.PuppetClasses.length,
            class_list: this.Hosts.PuppetClasses.map(function (ob) { return ob.id + " (" + ob.count + ")"}).join(", ")
        }));
    },
});

$(function(){
  window.App = new AppView;
});
