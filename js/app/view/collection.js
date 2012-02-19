/**
   View for a collection

   Mandatory parameters:

   elementView - Class implementing the view for an individual model element
   collection - A backbone collection of models

   Optional parameters:

   elementViewParameters - a hash of parameters to be passed down into
                           constructed element views. This is cloned and
                           the 'model' parameters is added during construction

*/
var CollectionView = Backbone.View.extend({
    initialize: function() {
        if (!this.collection) {
            throw("CollectionView must be constructed with a collection");
        }
        if (this.options.elementView) {
            this.elementView = this.options.elementView;
        }
        if (!this.elementView) {
            throw("CollectionView must be constructed with an elementView");
        }
        this.elementViewParameters = this.options.elementViewParameters || {};
        this.collection.on('add',   this.addOne, this);
        this.collection.on('reset', this.addAll, this);
        this.collection.on('all',   this.render, this);
    },
    addOne: function(ob) {
      var params = _.clone(this.elementViewParameters);
      params.model = ob; // Add in the model object
      var view = new this.elementView(params);
      $(this.el).append(view.render().el);
    },
    addAll: function() {
        $(this.el).empty();
        this.collection.each(this.addOne, this);
    },
    // FIXME!?
    render: function() { }
});
