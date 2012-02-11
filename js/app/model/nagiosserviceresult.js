var NagiosServiceResult = Backbone.Model.extend({
    isOk: function () {
        //alert("In isOk");
        if (this.get("current_state") == "0") {
            //alert("ret 0");
            return true;
        }
        //alert('ret 1');
        return false;
    }
});
