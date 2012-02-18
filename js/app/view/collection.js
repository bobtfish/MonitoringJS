var CollectionView = Backbone.View.extend({
    initialize: function() {
        this.Collection = this.options.Collection;
        this.ElementView = this.options.ElementView;
        this.Collection.bind('add',   this.addOne, this);
        this.Collection.bind('reset', this.addAll, this);
        this.Collection.bind('all',   this.render, this);
    },
    addOne: function(ob) {
      var view = new this.elementview.call({model: ob});
      this.$el.append(view.render().el);
    },
    addAll: function() {
        var collection = this.Collection;
        this.$el.empty();
        this.Collection.each(this.addOne, this);
    },
    render: function() { "" }
});
