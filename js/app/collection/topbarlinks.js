var TopBarLinks = MyCollection.extend({
    model: TopBarLink,
    localStorage: new Store("TopBarLinks"),
    url: '/topbar.json',
});
