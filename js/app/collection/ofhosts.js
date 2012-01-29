var CollectionOfHosts = Backbone.Collection.extend({
  model: window.Host,
  parse: function(response) {
      var rows = response.rows;
      $.each(rows, function(index, value) { /* This logic should be in the model class we inflate */
          var id = value["_id"]["$oid"];
          value["id"] = id;
          delete value["_id"];
          delete value["agentlist"];
          delete value["classes"];
          delete value["extra"];
          value["fqdn_sortable"] = value["facts"]["fqdn"].split('.').reverse().join('.');
          $.each(["ps", "kernel", "title", "facterversion", "hardwareisa", "rubysitedir", "rubyversion",
                "module_name", "selinux", "type", "caller_module_name", "never", "files", "servername", "id"],
            function(i, name) { delete value["facts"][name] });
      });
      return rows;
  },
  comparator: function(ob) {
      return ob.get("fqdn_sortable");
  },
  url: 'file:///Users/t0m/test-backbone/nodes.json'
});
window.Hosts = new CollectionOfHosts;
