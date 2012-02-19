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
    },
    parse_nagios_service_update: function(data) {
        //console.log("Update self from " + JSON.stringify(data, false, 2));
        if (data.current_state == "OK") {
            this.set({"current_state": 0}, {silent: true});
        }
        else { // FIXME - There is a warning state?
            this.set({"current_state": 1}, {silent: true});
        }
        this.set({plugin_output: data.plugin_output, last_check: data.last_check}, {silent: true});
        this.change();
    }
});
