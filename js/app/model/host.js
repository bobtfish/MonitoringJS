var Host = Backbone.Model.extend({
    initialize: function () {
        delete this.attributes["agentlist"];
        delete this.attributes["extra"];
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
        this.set({'nagios_results': collectionOfNagiosResults});
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
    isOk: function() {
        var res = this.get('nagios_results');
        if (!res) {
            if (this.hasPuppetClass("nagios_client::do_not_monitor")) {
                return true;
            }
            return false;
        }
        return res.isOk();
    }
});
