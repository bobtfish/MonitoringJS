var CollectionOfHosts = Backbone.Collection.extend({
  model: window.Host,
  parse: function(response) {
      return response.rows;
  },
  url: 'file:///Users/t0m/test-backbone/nodes.json'
});
window.Hosts = new CollectionOfHosts; 

