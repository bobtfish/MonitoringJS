var CollectionOfHosts = Backbone.Collection.extend({
  model: window.Host,
  parse: function(response) {
      return response.rows;
  },
  url: '/puppet/nodes/'
});
window.Hosts = new CollectionOfHosts; 

