module("Host Model");

test("Construction and Simple use", function() {
  var host = new Host({
      agentlist: "foo", extra: "foo", classes: [], facts: {fqdn: "foo.example.com", controllertype: "Someraid"}, lastseen: 1328044394
  });
  ok( host, "Constructed host" );
  equal( host.attributes.agentlist, undefined, "We expect value to be null" );
  equal( host.attributes.extra, undefined, "We expect value to be null" );
  equal( host.attributes.fqdn_sortable, 'com.example.foo', "fqdn_sortable" );
  equal( host.attributes.lastseen_string, "Tue Jan 31 2012 21:13:14 GMT+0000 (GMT)", "Last seen as nice date" ); // FIXME
  ok( host.hasRaid(), 'Host has raid');
  equal( host.raidController(), "Someraid", "host.raidController() is Someraid");
});

test("hasRaid empty string", function() {
  var host = new Host({
      agentlist: "foo", extra: "foo", classes: [], facts: {fqdn: "foo.example.com", controllertype: ""}, lastseen: 1328044394
  });
  ok( !host.hasRaid(), 'Host does not have raid given empty string');
});

module("Puppetclass Model");

test("Construction and Simple use", function() {
  var ob = new PuppetClass({
      id: "foo"
  });
  ok( ob, "Constructed class" );
  equal( ob.incCount(), 1, "ob.incCount() returns 1");
  equal( ob.get("count"), 1, "Count attribute is 1");
  
});
  