var Host = Backbone.Model.extend({
    initialize: function () {
        delete this.attributes["agentlist"];
        delete this.attributes[":extra"];
        this.attributes["fqdn_sortable"] = this.attributes["facts"]["fqdn"].split('.').reverse().join('.');
        var me = this;
        $.each(["ps", "kernel", "title", "facterversion", "hardwareisa", "rubysitedir", "rubyversion", "lsbrelease",
                "module_name", "selinux", "type", "caller_module_name", "never", "files", "servername", "id", "puppetversion"],
            function(i, name) { delete me.attributes["facts"][name] });
        var lastseen = new Date(1000*this.attributes["lastseen"]);
        this.attributes["lastseen_string"] = lastseen.toString();
        var PuppetClasses = this.attributes["_PuppetClasses"];
        delete this.attributes["_PuppetClasses"];
        $.each(this.attributes["classes"], function (i, name) { PuppetClasses.add_unless_exists(name) });
    },
    parse_nagios: function(data) {
        var host = this;
        var rows = [];//FIXME - This logic should be in the collection!
        $.each(data.services, function(servicename, value) {
              value.name = servicename;
              value.id = host.get("fqdn") + "_" + servicename;
              rows.push(value);
        });
        var collectionOfNagiosResults = new CollectionOfNagiosResults(rows);
        collectionOfNagiosResults.host_fqdn = host.get("fqdn");
        this.set({'nagios_results': collectionOfNagiosResults}, {silent: true});
        collectionOfNagiosResults.on("change", this.nagios_change, this);
    },
    nagios_change: function(collection, model) {
        //console.log("Host " + this.get("fqdn") + " got changed nagios state " + this.isOk());
        this.trigger("change", this);
        // XXX - Do this, but verify this is really a state change first!
        //this.collection.sort();
    },
    parse_nagios_service_update: function(update) {
        //console.log("Host " + this.get("id") + " got nagios update " + JSON.stringify(update, false, 2));
        var nagios_results = this.get('nagios_results');
        if (!nagios_results) {
            return;
        }
        nagios_results.parse_nagios_service_update(update);
    },
    hasPuppetClass: function (name) {
        return _.any(this.get("classes"), function (test_name) { return test_name == name });
    },
    hasRaid: function () {
        return this.get("facts").controllertype.length > 0;
    },
    raidController: function () {
        return this.get("facts").controllertype;
    },
    graphUrl: function(name) {
        return "/cgi-bin/munin-cgi-graph/" + this.get("facts").domain + "/" + this.get("facts").fqdn + "/" + name + ".png";
    },
    doNotMonitor: function() {
        if (this.hasPuppetClass("nagios_client::do_not_monitor")) {
            return true; // Not monitored
        }
        return false;
    },
    isOk: function() {
        var res = this.get('nagios_results');
        if (!res) {
            if (this.doNotMonitor()) {
                return -1; // Not monitored
            }
            return -2; // Do data
        }
        if (res.isOk()) {
            return "1";
        }
        else {
            return "0";
        }
    },
    isOkcompartor: function() {
        return this.isOk() + 2;
    },
    iconClass: function() {
        var ok = this.isOk();
        if (ok == 1) {
            return "ok";
        }
        if (ok == 0) {
            return "remove";
        }
        if (ok == -2) {
            return "question-sign";
        }
        if (ok == -1) {
            return "ban-circle";
        }
        alert("Unknown " + ok);
    },
    failed_nagios_results: function() {
        var nagios_results = this.get('nagios_results');
        if (!nagios_results) {
            return [];
        }
        return this.get('nagios_results').clone_and_filter_failed();
    }
});
