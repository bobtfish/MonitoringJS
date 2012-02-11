var CollectionOfNagiosHostGroups = Backbone.Collection.extend({
    model: NagiosHostGroup,
    parse: function(response) {
        var collection = this;
        var by_group = {};
        $.each(response.rows, function(index, value) { /* This logic is mostly duplicated from collectionofhosts FIXME */
            if (!by_group[value.group_name]) {
                by_group[value.group_name] = [value.fqdn]
            }
            else {
                by_group[value.group_name].push(value.fqdn);
            }
        });
        var rows = [];
        $.each(by_group, function(group_name, hosts) { rows.push({id: group_name, "hosts": hosts}) });
        return rows;
    },
    url: '/puppet/nagios_host_groups/',
    comparator: function(ob) {
        return ob.isOkcompartor() + ob.get("id");
    },
});
