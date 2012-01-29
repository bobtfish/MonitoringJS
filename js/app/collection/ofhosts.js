var CollectionOfHosts = Backbone.Collection.extend({
  model: window.Host,
  initialize: function() {
      this.PuppetClasses = new CollectionOfPuppetClasses;
      this.bind('reset', function () { this.PuppetClasses.sort() }, this);
  },
  parse: function(response) {
      var collection = this;
      var rows = [];
      $.each(response.rows, function(index, value) { /* This logic should be in the model class we inflate */
          var id = value["_id"]["$oid"];
          value["id"] = id;
          delete value["_id"];
          value["_PuppetClasses"] = collection.PuppetClasses;
          rows.push(new Host(value));
      });
      return rows;
  },
  clone_and_filter: function(iterator) {
      var newob = new CollectionOfHosts();
      newob.reset(this.filter(iterator));
      return newob;
  },
  clone_and_filter_by_class: function(classname) {
      var filter = function(ob) { var x = _.any(ob.get("classes"), function(val){ return val == classname }); return x; };
      return this.clone_and_filter( filter );
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
