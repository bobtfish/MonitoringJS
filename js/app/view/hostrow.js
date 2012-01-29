var HostRow = Backbone.View.extend({
    tagName: "li",
    className: "host-row",
    template: _.template($('#host-template').html()),
    events: {
        "click a.host-detail"   : "show_detail",
    },
    render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
    show_detail: function() {
        App.Hosts.selected(this.model);
    }
});
