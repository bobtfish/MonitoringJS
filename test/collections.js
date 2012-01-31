module("Puppet classes collection");

test("Construction and Simple use", function() {
  var coll = new CollectionOfPuppetClasses({});
  ok( coll, "Have collection" );
});

