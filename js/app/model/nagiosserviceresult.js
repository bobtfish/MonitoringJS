var NagiosServiceResult = Backbone.Model.extend({
    isOk: function () {
        return this.get("current_state") == "0";
    }
});
