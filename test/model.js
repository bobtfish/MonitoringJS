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

module("NagiosDerviceResult Model");

test("Construction and Simple use - ok", function() {
  var ob = new NagiosServiceResult({
    "plugin_output": "Time difference is less than 10 seconds: -1",
    "notifications_enabled": "1",
    "downtimes": {},
    "scheduled_downtime_depth": "0",
    "problem_has_been_acknowledged": "0",
    "comments": {},
    "current_state": "0",
    "active_checks_enabled": "1",
    "last_hard_state": "0",
    "last_check": "1327923057",
    "last_notification": "0",
    "name": "TIMESYNC",
    "id": "camel.cissme.com_TIMESYNC"
  });
  ok( ob, "Constructed class" );
  ok( ob.isOk(), "ob.isOk() true");
});

test("Construction and Simple use - not ok", function() {
  var ob = new NagiosServiceResult({
    "plugin_output": "Critical: number of incomplete replications is 70",
    "notifications_enabled": "1",
    "downtimes": {},
    "scheduled_downtime_depth": "0",
    "problem_has_been_acknowledged": "1",
    "comments": {},
    "current_state": "2",
    "active_checks_enabled": "1",
    "last_hard_state": "2",
    "last_check": "1327920163",
    "last_notification": "0",
    "name": "REPL_INCOMPLETE",
    "id": "camel.cissme.com_REPL_INCOMPLETE"
  });
  ok( ob, "Constructed class" );
  ok( !ob.isOk(), "ob.isOk() false");
});
