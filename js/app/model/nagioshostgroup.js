var NagiosHostGroup = Backbone.Model.extend({
    hosts: function() {
        return this.get("hosts");
    },
    hostCount: function() {
        var count = 0;
        _.each(this.get("hosts"), function(fqdn) {
            var host = this.collection.hostsCollection.get(fqdn);
            if (host && host.doNotMonitor()) { } else { count++ };
        }, this);
        return count;
    },
    isOk: function() {
        var res = 1;
        var set_res = 0;
        _.each(this.get("hosts"), function(fqdn) {
            var host = this.collection.hostsCollection.get(fqdn);
            if (host) {
                var isOk = host.isOk();
                if (isOk == 0) {
                    res = 0;
                    set_res = 1;
                }
                if (isOk == 1) {
                    set_res = 1;
                }
            }
        }, this);
        if (res == 1 && set_res == 0) {
            res = -2;
        }
        return res;
    },
    iconClass: function() {
        var ok = this.isOk();
        if (ok == 1) {
            return "ok";
        }
        if (ok == 0) {
            return "remove"; // FAILED
        }
        if (ok == -2) {
            return "question-sign";
        }
        if (ok == -1) {
            return "ban-circle";
        }
        alert("Unknown " + ok);
    },
    isOkcompartor: function() {
        return this.isOk() + 2;
    },
});
