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
    }
});
