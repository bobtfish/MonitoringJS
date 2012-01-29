var CollectionOfPuppetClasses = Backbone.Collection.extend({
  model: PuppetClass,
  add_unless_exists: function (name) {
      var already = this.get(name);
      if (already) {
          already.incCount();
      }
      else {
          var thing = new PuppetClass({ id: name });
          thing.count = 1;
          this.add(thing);
      }
  },
  comparator: function(ob) {
      return ob.get("count");
  },
});
