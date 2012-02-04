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

module("Hosts collection");

test("Construct", function() {
  var coll = new CollectionOfHosts;
  equals(coll.length, 0, "Zero entries");
  coll.add({agentlist: "foo", extra: "foo", classes: [], facts: {fqdn: "foo.example.com", controllertype: "Someraid"}, lastseen: 1328044394});
  equals(coll.length, 1, "One entry");
});

test("PuppetClasses", function() {
  var puppetclasses = new CollectionOfPuppetClasses;
  var coll = new CollectionOfHosts([
      {_PuppetClasses: puppetclasses, agentlist: "foo", extra: "foo", classes: ["foo", "bar"], facts: {fqdn: "foo.example.com", controllertype: "Someraid"}, lastseen: 1328044394},
      {_PuppetClasses: puppetclasses, agentlist: "foo", extra: "foo", classes: ["foo", "baz"], facts: {fqdn: "zzz.example.aaa", controllertype: "Someraid"}, lastseen: 1328044394}
  ]);
  equals(coll.length, 2, "Two entries");
  ok(coll.PuppetClasses, "Has PuppetClasses collection");
  equals(puppetclasses.length, 3, "Three classes");
  var models = coll.toArray();
  equals( models.length, 2, 'Length 2');
  equals( models[0].get("facts").fqdn, "zzz.example.aaa" );
  equals( models[1].get("facts").fqdn, "foo.example.com" );

  var two = coll.clone_and_filter_by_class("foo");
  equals(two.length, 2);

  var oneA = coll.clone_and_filter_by_class("bar");
  var oneB = coll.clone_and_filter_by_class("baz");
  equals(oneA.length, 1);
  equals(oneB.length, 1);
});

asyncTest("Load test data", function() {
  var coll = new CollectionOfHosts;
  coll.bind("reset", function() {
      start();
      ok(1, "Was reset");
      equals(coll.length, 74, "74 hosts");
  })
  coll.fetch();
});
stop();

asyncTest("Selected host", function() {
  var coll = new CollectionOfHosts;
  ok( !coll.has_selected(), "No host selected" );
  coll.bind("host_selected", function (host) {
      start();
      ok(1, "Was selected");
      equals(host, "foo.example.com"); // FIXME!
  });
  coll.selected("foo.example.com");
  ok( coll.has_selected(), "Has a selected" );
});
stop();