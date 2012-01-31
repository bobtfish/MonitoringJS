module("Puppet classes collection");

test("Construction and Simple use", function() {
  var coll = new CollectionOfPuppetClasses;
  ok( coll, "Have collection" );
  equals( coll.length, 0, "Collection with 0 items" );
  coll.add_unless_exists("foo");
  coll.add_unless_exists("bar");
  equals( coll.length, 2, "Collection with 2 items" );
  coll.add_unless_exists("foo");
  coll.add_unless_exists("bar");
  equals( coll.length, 2, "Collection still has 2 items" );
  coll.add_unless_exists("baz");
  equals( coll.length, 3, "Collection now has 3 items" );
  coll.sort();
  var models = coll.toArray();
  equals( models.length, 3, 'Length 3');
  equals( models[0].id, "baz" );
  equals( models[1].id, "bar" );
  equals( models[2].id, "foo" );
  equals( models[0].get("count"), 1 );
  equals( models[1].get("count"), 2 );
  equals( models[2].get("count"), 2 );
});
