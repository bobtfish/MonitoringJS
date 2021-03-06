// This is the top level application class.
// It sets up the rest of the application..

var AppView = Backbone.View.extend({
    initialize: function() {
        var eventRouter = _.clone(Backbone.Events)
        var hippie = ourHippie(eventRouter);
        this.eventRouter = eventRouter;
        this.hippie = hippie;

        var topbarLinksCollection = new TopBarLinks;
        this.topbarLinksCollection = topbarLinksCollection;

        this.topbarLinksListView = new TopbarLinksListView({
            collection: this.topbarLinksCollection
        });
        topbarLinksCollection.fetch();

        var hostsCollection = new CollectionOfHosts;
        hostsCollection.add_event_router(eventRouter);
        this.hostsCollection = hostsCollection;
        var nagiosHostGroupsCollection = new CollectionOfNagiosHostGroups();
        // FIXME - Should be able to inject parameters into a Collection's constructor!
        nagiosHostGroupsCollection.hostsCollection = this.hostsCollection;
        this.NagiosHostGroupsCollection = nagiosHostGroupsCollection;
        this.NagiosHostGroupsCollection.add_event_router(eventRouter);
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
        $('#nagios_hostgroups').hide();
        $('#hostdetails').html(this.hostTemplate({host: this.hostsCollection.get(id)}));
        $('#hostdetails').show();
        $('.tabs').tab('show');
    },
    render_nagios_hostgroups: function() {
        $('#hostdetails').hide();
        $('#nagios_hostgroups').show();
    },
    // FIXME
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
