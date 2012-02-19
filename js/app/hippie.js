var ourHippie = function (event_router) {
    var object = {};
    var hippie = new Hippie( document.location.host, 5, function() {
            event_router.trigger("hippie:connected", "ok");
            console.log("Hippie: Connected");
        },
        function() {
            event_router.trigger("hippie:disconnected", "ok");
            console.log("Hippie: disconnected");
        },
        function(e) {
            event_router.trigger("hippie:message:" + e.type, e);
            console.log("Hippie: got message: " + JSON.stringify(e));
        }
    );

    object.hippie = hippie;

    return object;
};

