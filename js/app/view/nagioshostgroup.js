var NagiosHostGroupView = Backbone.View.extend({
    tagName: "li",
    template: _.template($('#nagioshostgroup-item-template').html()),
    initialize: function() {
        this.model.bind('change', this.render, this);
        this.model.bind('destroy', this.remove, this);
    },
    isOk: function() {
        return "0";
    },
    iconClass: function() {
        var ok = this.isOk();
        if (ok == 1) {
            return "ok";
        }
        if (ok == 0) {
            return "remove";
        }
        if (ok == -2) {
            return "question-sign";
        }
        if (ok == -1) {
            return "ban-circle";
        }
        alert("Unknown " + ok);
    },
    render: function() {
        var data = this.model.toJSON();
        data.isOk = this.isOk();
        data.iconClass = this.iconClass();
        $(this.el).html(this.template(data));
        return this;
    },
});
