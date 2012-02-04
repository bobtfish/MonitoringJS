var CollectionOfNagiosResults = Backbone.Collection.extend({
  model: NagiosServiceResult,
  isOk: function () {
      return this.all(function(val){ return val.isOk() });
  }
});

