var PuppetClass = Backbone.Model.extend({
    incCount: function () {
        if (!this.count) {
            this.count = 0;
        }
        this.count = this.count + 1;
    }
});
