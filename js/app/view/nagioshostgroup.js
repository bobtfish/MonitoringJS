var NagiosHostGroupView = Backbone.View.extend({
    tagName: "div",
    template: _.template($('#nagioshostgroup-item-template').html()),
    inner_template: _.template($('#nagioshostgroup-item-host-template').html()),
    initialize: function() {
        this.model.on('change', this.render, this);
        this.model.on('destroy', this.remove, this);
        this.hostsCollection = this.options.hostsCollection;
        this.hostsCollection.bind('reset', this.render, this);
    },
    render: function() {
        var data = this.model.toJSON();
        data.isOk = this.model.isOk();
        data.iconClass = this.model.iconClass();
        data.hostCount = this.model.hostCount();
        data.hosts = this.model.monitorable_host_names();
        data.hostObjects = this.model.monitorable_hosts();
        var row = '<tr>' + this.template(data) +
            this.inner_template(data) + '</tr>';
        $(this.el).html(row);
        return this;
    },
    events: {
        "click a.nagioshostgroup-detail"   : "show_detail",
    },
    show_detail: function() {
        alert("Not implemented, sorry");
    }
});
