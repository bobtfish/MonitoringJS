// Implements the view for the hosts down the left hand side of the page
var HostListView = CollectionView.extend({
    el: $("#host-list"),
    elementView: HostRowView
});
