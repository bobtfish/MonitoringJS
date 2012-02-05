var HostRow = Backbone.View.extend({
    tagName: "li",
    className: "host-row",
    template: _.template($('#host-template').html()),
    events: {
        "click a.host-detail"   : "show_detail",
    },
    render: function() {
        var data = this.model.toJSON();
        data.isOk = this.model.isOk();
        $(this.el).html(this.template(data));
        return this;
    },
    show_detail: function() {
        App.HostsModel.selected(this.model);
    }
});
