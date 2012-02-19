/* Implments a nagios host group

   Properties:
       hosts - list of fqdns
       
    Methods:
        hosts - returns an array of host objects, looked up from the hosts collection
                by fqdn
    
        isOk - Returns the nagios status of a host
               FIXME - Code meanings here?
               -2 = unknown
               1 = broken
               0 = ok
               
*/
var NagiosHostGroup = Backbone.Model.extend({
    hosts: function() {
        return _.map(this.get("hosts"), function(fqdn) {
            return this.collection.hostsCollection.get(fqdn);
        }, this);
    },
    monitorable_hosts: function() {
        return _.filter(this.hosts(), function(host) { if (!host) { return false }; return !host.doNotMonitor(); });
    },
    monitorable_host_names: function() {
        return _.map(this.monitorable_hosts(), function(host) {
            return host.get("facts")["fqdn"];
        }, this);
    },
    hostCount: function() {
        return this.monitorable_hosts().length;
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
