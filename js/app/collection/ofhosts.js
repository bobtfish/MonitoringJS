// Main collection of all hosts
var CollectionOfHosts = MyCollection.extend({
  model: Host,
  initialize: function() {
      this.PuppetClasses = new CollectionOfPuppetClasses;
      this.on('reset', function () {
          this.PuppetClasses.sort()
      }, this);
  },
  parse: function(response) {
      var collection = this;
      var rows = [];
      $.each(response.rows, function(index, value) { /* This logic should be in the model class we inflate */
          var id = value["_id"]["$oid"];
          value["_id"] = id;
          value["id"] = value["facts"]["fqdn"];
          value["_PuppetClasses"] = collection.PuppetClasses;
          rows.push(value);
      });
      return rows;
  },
  parse_nagios: function(response) {
      var collection = this;
      $.each(response.content, function(hostname, value) {
          var thisHost = collection.get_by_hostname(hostname);
          if (thisHost) {
              thisHost.parse_nagios(value);
          }
      });
      collection.sort();
  },
  clone_and_filter_by_class: function(classname) {
      return this.clone_and_filter_by_property("classes", classname);
  },
  comparator: function(ob) {
      return ob.isOkcompartor() + ob.get("fqdn_sortable");
  },
  url: '/puppet/nodes/',
  add_event_router: function (eventRouter) {
      this.eventRouter = eventRouter;
      eventRouter.on("hippie:message:nagios_service_alert", this.nagios_service_update, this);
      this.on("change", function(host) { 
          //alert("Thing changed " + JSON.stringify(host.get("fqdn"), false, 2) )
          eventRouter.trigger("host_status_change", host.get("fqdn"));
      }, this);
  },
  nagios_service_update: function(msg) {
      //console.log("CollectionOfHosts: got message: " + JSON.stringify(msg, false, 2));
      var host = this.get_by_hostname(msg.hostname);
      if (host) {
          host.parse_nagios_service_update(msg);
      }
  },
  get_by_hostname: function(hostname) {
      return this.find(function (host) { return hostname == host.get("facts").hostname });
  }
});
