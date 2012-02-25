var TopBarLinkView = Backbone.View.extend({
    tagName: "li",
    template: _.template($('#top-bar-link').html()),
    initialize: function() {
        this.model.on('change', this.render, this);
        this.model.on('destroy', this.remove, this);
    },
    render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});