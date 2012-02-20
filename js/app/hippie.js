var ourHippie = function (event_router) {
    var object = {};
    object.buildHippie = function() {
        var hippie = new Hippie( document.location.host, 5, function() {
                event_router.trigger("hippie:connected", "ok");
                console.log("Hippie: Connected");
                object.connected = 1;
                object.connecting_timeout = false;
            },
            function() {
                event_router.trigger("hippie:disconnected", "ok");
                console.log("Hippie: disconnected");
                object.connected = false;
                object.connecting_timeout = false;
                object.hippie = false;
            },
            function(e) {
                event_router.trigger("hippie:message:" + e.type, e);
                //console.log("Hippie: got message: " + JSON.stringify(e));
            }
        );
        object.hippie = hippie;
        object.connecting_timeout = setTimeout(function () {
            if (!object.connected && object.connecting_timeout && !object.new_hippie_timeout) {
                console.log("Hippie: Connection timed out, restarting connect");
                object.connected = false;
                object.new_hippie_timeout = false;
                object.connecting_timeout = false;
                object.hippie = false;
                object.buildHippie();
            }
            else {
                object.connecting_timeout = false;
            }
        }, 30000);
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

