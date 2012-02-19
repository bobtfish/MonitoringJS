// Implements the list of all nagios host groups
var NagiosHostGroupListView = CollectionView.extend({
    el: $("#nagios_hostgroups"),
    elementView: NagiosHostGroupView
});
