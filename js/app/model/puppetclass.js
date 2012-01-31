var PuppetClass = Backbone.Model.extend({
    defaults: {
        count: 0
    },
    incCount: function () {
        if (!this.count) {
            this.count = 0;
        }
        var val = this.get("count")+1;
        this.set({"count": val});
        return this.get("count");
    }
});
