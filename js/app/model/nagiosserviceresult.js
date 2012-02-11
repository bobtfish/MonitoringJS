var NagiosServiceResult = Backbone.Model.extend({
    initialize: function () {
        delete this.attributes["agentlist"];
        var date = new Date( this.get("last_notification") *1000);
        this.set({"last_notification":  date});
        return this;
    },
    isOk: function () {
        //alert("In isOk");
        if (this.get("current_state") == "0") {
            //alert("ret 0");
            return true;
        }
        //alert('ret 1');
        return false;
    }
});
