var CollectionView = Backbone.View.extend({
    initialize: function() {
        this.Collection = this.options.collection;
        if (!this.Collection) {
            throw("CollectionView must be constructed with a collection");
        }
        if (this.options.elementView) {
            this.elementView = this.options.elementView;
        }
        if (!this.elementView) {
            throw("CollectionView must be constructed with an elementView");
        }
        this.ElementViewParameters = this.options.elementViewParameters || {};
        this.Collection.bind('add',   this.addOne, this);
        this.Collection.bind('reset', this.addAll, this);
        this.Collection.bind('all',   this.render, this);
    },
    addOne: function(ob) {
      var params = _.clone(this.ElementViewParameters);
      params.model = ob;
      var view = new this.elementView(params);
      $(this.el).append(view.render().el);
    },
    addAll: function() {
        var collection = this.Collection;
        $(this.el).empty();
        this.Collection.each(this.addOne, this);
    },
    render: function() { "" }
});
