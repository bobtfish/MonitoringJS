var CollectionOfNagiosHostGroups = MyCollection.extend({
    model: NagiosHostGroup,
    parse: function(response) {
        var collection = this;
        var by_group = {};
        // FIXME - This should be metadata, not hard coded here
        var skip_groups = [
            "eight-disk-h200-servers",
            "four-disk-3ware-servers",
            "has-3ware-raid",
            "has-3ware-raid2",
            "ixn-servers",
            "ixn-storage-servers",
            "mogile-ramdisk",
            "no-nginx",
            "no-var",
            "twelve-disk-h200-servers",
            "web-servers",
            "eight-disk-3ware-jbod-servers",
            "eight-disk-3ware-servers",
            "eight-disk-h700-servers",
            "four-disk-3ware-jbod-servers",
            "four-disk-h700-servers",
            "has-h700",
            "has-h700-raid",
            "has-h700-raid2",
            "has-megaraid",
            "two-disk-3ware-servers",
        ];
        $.each(response.rows, function(index, value) { /* This logic is mostly duplicated from collectionofhosts FIXME */
            if (!_.any(skip_groups, function(this_group) { return this_group == value.group_name })) {
                if (!by_group[value.group_name]) {
                    by_group[value.group_name] = [value.fqdn]
                }
                else {
                    by_group[value.group_name].push(value.fqdn);
                }
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
