var AppView = Backbone.View.extend({
    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#todoapp"),

    initialize: function() {
        this.HostsModel = new CollectionOfHosts;
        this.HostsModel.bind('add',   this.addOne, this);
        this.HostsModel.bind('reset', this.addAll, this);
        this.HostsModel.bind('all',   this.render, this);
        this.HostsModel.bind('host_selected', this.render_one_host, this);
        this.HostsModel.fetch();
    },
    addOne: function(host) {
      var view = new HostRowView({model: host});
      this.$("#host-list").append(view.render().el);
    },
    addAll: function() {
        var appview = this;
        var hosts_collection = this.HostsModel;
        hosts_collection.each(appview.addOne);
        if (!appview.haveRendered) {
            $.get('/nagios-api/state', function(data) {
              hosts_collection.parse_nagios(data);
              $("#host-list").empty();
              appview.addAll();
            });
        }
        appview.haveRendered = 1;
    },
    statsTemplate: _.template($('#stats-template').html()),
    hostTemplate: _.template($('#host-detail-template').html()),
    classListTemplate: _.template($('#class-list-item-template').html()),
    render_one_host: function() {
        $('#hostdetails').html(this.hostTemplate({host: this.HostsModel.selected_host}));
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
        var Hosts = this.HostsModel;
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
