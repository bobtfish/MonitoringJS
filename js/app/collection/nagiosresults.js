var CollectionOfNagiosResults = MyCollection.extend({
  model: NagiosServiceResult,
  isOk: function () {
      return this.all(function(val){ return val.isOk() });
  },
  comparator: function(ob) {
      return ob.isOk() + ob.get("name");
  },
  clone_and_filter_failed: function() {
      return this.clone_and_filter_by_iterator(function(ob) {
          return !ob.isOk();
      });
  },
});
