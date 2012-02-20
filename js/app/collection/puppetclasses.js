// A collection of puppet classes, possesed by a host.
var CollectionOfPuppetClasses = MyCollection.extend({
  model: PuppetClass,
  add_unless_exists: function (name) {
      var already = this.get(name);
      if (already) {
          already.incCount();
      }
      else {
          this.add({ id: name, count: 1 });
      }
  },
  comparator: function(ob) {
      return ob.get("count");
  },
});
