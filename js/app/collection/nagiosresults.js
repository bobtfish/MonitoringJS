var CollectionOfNagiosResults = MyCollection.extend({
  model: NagiosServiceResult,
  isOk: function () {
      return this.all(function(val){ return val.isOk() });
  },
  comparator: function(ob) {
      if (!ob) {
          return;
      }
      return ob.isOk() + ob.get("name");
  },
  clone_and_filter_failed: function() {
      return this.clone_and_filter_by_iterator(function(ob) {
          return !ob.isOk();
      });
  },
  parse_nagios_service_update: function(update) {
      var id = this.host_fqdn + "_" + update.service
      var result = this.get(id);
      if (result) {
          result.parse_nagios_service_update(update);
      }
      else {
          console.log("Collection of nagios updates for " + id + " found no result for " + JSON.stringify(update, false, 2));
      }
  },
});
