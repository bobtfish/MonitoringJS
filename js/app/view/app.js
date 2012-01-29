window.AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#todoapp"),

    template: _.template($('#item-template').html()),

    initialize: function() {
	alert("MOO");
        window.Hosts.bind('add',   this.addOne, this);
        window.Hosts.bind('reset', this.addAll, this);
        window.Hosts.bind('all',   this.render, this);
        window.Hosts.fetch();
/*        $.getJSON('/puppet/nodes/', function(data) {
            $.each(data.rows, function(count, row) {
                alert(row.facts.ipaddress);
            });
        }); */
    },
});

