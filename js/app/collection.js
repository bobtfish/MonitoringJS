// General collection class.
var MyCollection = Backbone.Collection.extend({
    clone_and_filter_by_iterator: function(iterator) {
        var newob = new this.constructor(this.atributes);
        newob.clonedFrom = this;
        newob.reset(this.filter(iterator));
        return newob;
    },
    clone_and_filter_by_property: function(filter_property, filter_value) {
        var filter = function(ob) { var x = _.any(ob.get(filter_property), function(val){ return val == filter_value }); return x; };
        return this.clone_and_filter_by_iterator( filter );
    },
});
