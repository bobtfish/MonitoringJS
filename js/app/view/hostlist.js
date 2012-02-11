var HostListView = Backbone.View.extend({
    el: $("#host-list"),

    initialize: function() {
        this.hostsCollection = this.options.hostsCollection;
        this.hostsCollection.bind('add',   this.addOne, this);
        this.hostsCollection.bind('reset', this.addAll, this);
        this.hostsCollection.bind('all',   this.render, this);
    },
    addOne: function(host) {
      var view = new HostRowView({model: host});
      $("#host-list").append(view.render().el);
    },
    addAll: function() {
        var appview = this;
        var hosts_collection = this.hostsCollection;
        $("#host-list").empty();
        hosts_collection.each(appview.addOne);
    },
    render: function() { "" }
});
