window.HostRow = Backbone.View.extend({
  tagName: "li",
  className: "host-row",
  template: _.template($('#host-template').html()),
  render: function() {
      var data = this.model.toJSON();
      data.pretty_printed_json = "<pre>" + JSON.stringify(data, undefined, 2) + "</pre>";
      $(this.el).html(this.template(data));
      return this;
  }
});
