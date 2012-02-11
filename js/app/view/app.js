var AppView = Backbone.View.extend({
    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#todoapp"),

    initialize: function() {
        this.hostsCollection = new CollectionOfHosts;
        this.hostsListView = new HostListView({"hostsCollection": this.hostsCollection})
        this.hostsCollection.bind('reset', this.addAll, this);
        this.hostsCollection.bind('all',   this.render, this);
        this.hostsCollection.fetch();
    },
    addAll: function() {
        var appview = this;
        var hosts_collection = this.hostsCollection;
        if (!appview.haveRendered) {
            $.get('/nagios-api/state', function(data) {
              hosts_collection.parse_nagios(data);
            });
        }
        appview.haveRendered = 1;
    },
    statsTemplate: _.template($('#stats-template').html()),
    classListTemplate: _.template($('#class-list-item-template').html()),
    hostTemplate: _.template($('#host-detail-template').html()),
    render_one_host: function(id) {
        $('#hostdetails').html(this.hostTemplate({host: this.hostsCollection.get(id)}));
        $('.tabs').tab('show');
    },
    interesting_classes: [
        "databaseserver_mysql",
        "kitten_varnish",
        "hudson_build_slave",
        "mogile_nginx",
        "cisupport",
        "mediaapi",
        "jobserver",
        "role_exportserver",
        "nagios_host"
    ],
    render: function() {
        var Hosts = this.hostsCollection;
        $('#hoststats').html(this.statsTemplate({
            total:      Hosts.length,
            total_classes: Hosts.PuppetClasses.length,
            class_list: _.map(this.interesting_classes, function (name) {
                var col = Hosts.clone_and_filter_by_class(name);
                return name + " (" + col.length + ")";
            }).join(", ")
        }));
    },
});

$(function(){
  window.App = new AppView;
});
