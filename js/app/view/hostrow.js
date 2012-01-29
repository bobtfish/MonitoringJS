window.HostRow = Backbone.View.extend({

  tagName: "li",

  className: "document-row",
  
  template: _.template($('#item-template').html()),

  events: {
  },

  render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      //$(this.el).html("<pre>" + JSON.stringify(this.model.toJSON(), undefined, 2) + "</pre>");
      return this;
  }

});

