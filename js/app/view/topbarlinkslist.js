var TopbarLinksListView = CollectionView.extend({
    el: $("#top-bar-list"),
    elementView: TopBarLinkView,
    localStorageCacheName: "TopbarLinksListViewCache"
});
