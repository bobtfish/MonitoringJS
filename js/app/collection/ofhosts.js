var CollectionOfHosts = Backbone.Collection.extend({
  model: window.Host,
  initialize: function() {
      this.PuppetClasses = new CollectionOfPuppetClasses;
      this.bind('reset', function () { this.PuppetClasses.sort() }, this);
  },
  parse: function(response) {
      var collection = this;
      var rows = response.rows;
      $.each(rows, function(index, value) { /* This logic should be in the model class we inflate */
          var id = value["_id"]["$oid"];
          value["id"] = id;
          delete value["_id"];
          delete value["agentlist"];
          delete value["extra"];
          value["fqdn_sortable"] = value["facts"]["fqdn"].split('.').reverse().join('.');
          $.each(["ps", "kernel", "title", "facterversion", "hardwareisa", "rubysitedir", "rubyversion", "lsbrelease",
                "module_name", "selinux", "type", "caller_module_name", "never", "files", "servername", "id", "puppetversion"],
            function(i, name) { delete value["facts"][name] });
          var lastseen = new Date(1000*value["lastseen"]);
          value["lastseen_string"] = lastseen.toString();
          $.each(value["classes"], function (i, name) { collection.PuppetClasses.add_unless_exists(name) });
      });
      return rows;
  },
  comparator: function(ob) {
      return ob.get("fqdn_sortable");
  },
  has_selected: function() {
      if (this.selected_host) { return true; } else { return false; }
  },
  selected: function(host) {
      this.selected_host = host;
      this.trigger("host_selected", host);
      return host;
  },
  url: 'file:///Users/t0m/test-backbone/nodes.json'
});
window.Hosts = new CollectionOfHosts;
