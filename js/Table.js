$(document).ready(function () {
    var username = document.cookie.match(/name=.*;?/);
    username = username[0].split('=')[1];
    $("#userName").html('<i class="fa fa-user" aria-hidden="true"></i>&nbsp'+username);
    $('#searchBtn').on('click', function (e) {
        e.preventDefault();
        var serilize_data= $('#tableRangeForm').serializeArray();
        var send_obj = {};
        $.map(serilize_data, function (n, i) {
            send_obj[n['name']] = n['value'];
        });
        console.log(send_obj);
        $.ajax({
            url: "/getTableRange",
            method: "POST",
            data: send_obj,
            dataType: "json",
            success: function (response) {
                console.log(response)
            }
        });
    });
});
