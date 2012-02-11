var NagiosHostGroupListView = Backbone.View.extend({
    el: $("#nagios_hostgroups"),

    initialize: function() {
        this.hostGroupCollection = this.options.hostGroupCollection;
        this.hostGroupCollection.bind('add',   this.addOne, this);
        this.hostGroupCollection.bind('reset', this.addAll, this);
        this.hostGroupCollection.bind('all',   this.render, this);
    },
    addOne: function(hostgroup) {
      var view = new NagiosHostGroupView({model: hostgroup});
      $("#nagios_hostgroups").append(view.render().el);
    },
    addAll: function() {
        var appview = this;
        var hosts_collection = this.hostGroupCollection;
        $("#nagios_hostgroups").empty();
        hosts_collection.each(appview.addOne);
    },
    render: function() { "" }
});
