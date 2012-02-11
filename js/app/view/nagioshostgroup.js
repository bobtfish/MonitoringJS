var NagiosHostGroupView = Backbone.View.extend({
    tagName: "li",
    template: _.template($('#nagioshostgroup-item-template').html()),
    initialize: function() {
        this.model.bind('change', this.render, this);
        this.model.bind('destroy', this.remove, this);
        this.hostsCollection = this.options.hostsCollection;
        this.hostsCollection.bind('reset', this.render, this);
    },
    render: function() {
        var data = this.model.toJSON();
        data.isOk = this.model.isOk();
        data.iconClass = this.model.iconClass();
        data.hostCount = this.model.hostCount();
        $(this.el).html(this.template(data));
        return this;
    },
});
