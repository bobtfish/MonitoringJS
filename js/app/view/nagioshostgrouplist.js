var NagiosHostGroupListView = Backbone.View.extend({
    el: $("#nagios_hostgroups"),

    initialize: function() {
        // Our main data source from the mongodb collection
        this.hostGroupCollection = this.options.hostGroupCollection;
        this.hostGroupCollection.bind('add',   this.addOne, this);
        this.hostGroupCollection.bind('reset', this.addAll, this);
        this.hostGroupCollection.bind('all',   this.render, this);
        // Hosts collection, passed into individual hostgroup views so they can call isOk on the hosts 
        this.hostsCollection = this.options.hostsCollection;
    },
    addOne: function(hostgroup) {
      var hostsCollection = this.hostsCollection;
      var view = new NagiosHostGroupView({model: hostgroup, "hostsCollection": hostsCollection});
      $("#nagios_hostgroups").append(view.render().el);
    },
    addAll: function() {
        var hosts_collection = this.hostGroupCollection;
        $("#nagios_hostgroups").empty();
        hosts_collection.each(this.addOne, this);
    },
    render: function() { "" }
});
