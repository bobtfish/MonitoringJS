var ourHippie = function (event_router) {
    var object = {};
    object.buildHippie = function() {
        var hippie = new Hippie( document.location.host, 5, function() {
                event_router.trigger("hippie:connected", "ok");
                console.log("Hippie: Connected");
            },
            function() {
                event_router.trigger("hippie:disconnected", "ok");
                console.log("Hippie: disconnected");
                object.hippie = false;
            },
            function(e) {
                event_router.trigger("hippie:message:" + e.type, e);
                //console.log("Hippie: got message: " + JSON.stringify(e));
            }
        );
        this.hippie = hippie;
        return hippie;
    };

    event_router.on("hippie:disconnected", function() {

        object.new_hippie_timeout = setTimeout(function () {
            console.log("Hippie: Reconnect");
            object.new_hippie_timeout = false;
            object.buildHippie();
        },3000);
    });

    object.buildHippie();

    return object;
};

