// This is the top level application class.
// It sets up the rest of the application..

var AppView = Backbone.View.extend({
    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#todoapp"),

    initialize: function() {
        var eventRouter = _.clone(Backbone.Events)
        var hippie = ourHippie(eventRouter);
        this.eventRouter = eventRouter;
        this.hippie = hippie;

        this.topbarLinksCollection = new TopBarLinks([
            {"href":"/cgi-bin/nagios3/status.cgi?servicestatustypes=28&amp;hoststatustypes=15","name": "Nagios","priority":"1"},
            {"href":"/munin/","name":"Munin","priotiry":"2"},
            {"href":"http://dashboard.state51.co.uk:3000","name":"Puppet dashboard","priotiry":"3"},
            {"href":"http://observer.playlouder.com/","name":"Observer","priotiry":"4"},
            {"href":"http://monitor.state51.co.uk/cgi-bin/smokeping.cg","name":"Smokeping","priotiry":"5"},
        ]);
        this.topbarLinksListView = new TopbarLinksListView({
            collection: this.topbarLinksCollection
        });
        this.topbarLinksListView.addAll();

        var hostsCollection = new CollectionOfHosts;
        hostsCollection.add_event_router(eventRouter);
        this.hostsCollection = hostsCollection;
        var nagiosHostGroupsCollection = new CollectionOfNagiosHostGroups();
        // FIXME - Should be able to inject parameters into a Collection's constructor!
        nagiosHostGroupsCollection.hostsCollection = this.hostsCollection;
        this.NagiosHostGroupsCollection = nagiosHostGroupsCollection;
        this.hostsListView = new HostListView({
            collection: this.hostsCollection,
        });
        this.nagiosHostGroupListView = new NagiosHostGroupListView({
            collection: nagiosHostGroupsCollection,
            elementViewParameters: { hostsCollection: hostsCollection },
        });
        hostsCollection.on('reset', this.addAll, this);
        hostsCollection.on('reset', function () { nagiosHostGroupsCollection.sort() }, this);
        hostsCollection.on('all',   this.render, this);
        hostsCollection.fetch();
        nagiosHostGroupsCollection.fetch();
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
