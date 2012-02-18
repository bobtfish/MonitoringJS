module("Collection View");

test("Test", function() {
  $('#testarea').empty();
  var c = new Backbone.Collection();
  var elv = Backbone.View.extend({
      tagName: "li",
      className: "arow",
      template: _.template('<%= foo %>'),
      initialize: function() {
          this.model.bind('change', this.render, this);
          this.model.bind('destroy', this.remove, this);
      },
      render: function() {
          $(this.el).html(this.template(this.model.toJSON()));
          return this;
      }
  });
  var cv = new CollectionView({collection: c, el: $('#testarea'), elementView: elv});
  c.add({foo: "bar"});
  ok(cv);
  var rendered = $('#testarea li');
  equals(rendered.html(), 'bar');
  equals(rendered.attr("class"), "arow");
  c.add({foo: "quux"});
  var things = [];
  $('#testarea li').each(function () {
      things.push($(this).html());
  });
  equals(things[0], 'bar');
  equals(things[1], 'quux');
  equals(things.length, 2);
  $('#testarea').empty();
});
