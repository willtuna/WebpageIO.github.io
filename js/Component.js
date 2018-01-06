var pie_inout_come = {
    labels: [],
    datasets: [{
        label: "Sessions",
        lineTension: .3,
        backgroundColor: ["#f00f0f", "#0ff00f"],
        pointRadius: 5,
        pointHoverRadius: 5,
        pointHitRadius: 20,
        pointBorderWidth: 2,
        data: []
    }]
};
var pie_second_category = {
    labels: [],
    datasets: [{
        label: "Sessions",
        lineTension: .3,
        borderColor: "rgba(2,117,216,1)",
        backgroundColor: ["#007bff", "#dc3545", "#ffc107", "#28a745", "#0305f3",'#00f20f','#abfff0'],
        pointRadius: 5,
        pointHoverRadius: 5,
        pointHitRadius: 20,
        pointBorderWidth: 2,
        data: []
    }]

};
var pie_third_category= {
    labels: [],
    datasets: [{
        lineTension: .3,
        borderColor: "rgba(2,117,216,1)",
        backgroundColor: ["#007bff", "#dc3545", "#ffc107"],
        pointRadius: 5,
        pointHoverRadius: 5,
        pointHitRadius: 20,
        pointBorderWidth: 2,
        data: []
    }]
};

var ctx_pie_inout_come = document.getElementById("inout_pie");
var pie_inout_g = new Chart(ctx_pie_inout_come, {
    type: 'pie',
    data: pie_inout_come
});

var ctx_pie_second = document.getElementById("second_pie");
var pie_second_g = new Chart(ctx_pie_second, {
    type: 'doughnut',
    data: pie_second_category
});
var ctx_pie_third = document.getElementById("third_pie");
var pie_third_g = new Chart(ctx_pie_third, {
    type: 'doughnut',
    data: pie_third_category
});

var pieinoutUpdate = function (obj_label_data) {

    pie_inout_g.data.datasets[0].data = obj_label_data.inout_data;
    pie_inout_g.data.labels = obj_label_data.inout_label;
    pie_inout_g.update()
};

var piesecondUpdate = function (obj_label_data) {
    pie_second_g.data.datasets[0].data = obj_label_data.second_data;
    pie_second_g.data.labels = obj_label_data.second_label;
    pie_second_g.update()
};
var piethirdUpdate = function (obj_label_data) {
    pie_third_g.data.datasets[0].data = obj_label_data.third_data;
    pie_third_g.data.labels = obj_label_data.third_label;
    pie_third_g.update()
};

$(document).ready(function () {
    $('#component_modal').modal({show:true});
    console.log("document ready");
    $.ajax({
        url: "/getComponent",
        method: "GET",
        success: function (response) {
            var in_out_obj = {
                inout_label: response.inout_label,
                inout_data: response.inout_data
            };
            var second_obj = {
                second_label: response.second_label,
                second_data: response.second_data
            };
            var third_obj= {
                third_label: response.third_label,
                third_data: response.third_data
            };
            console.log(third_obj);
            pieinoutUpdate(in_out_obj);
            piesecondUpdate(second_obj);
            piethirdUpdate(third_obj);
        }
    });

    $('#MonthRangeBotton').on('click', function (e) {
        e.preventDefault();
        var serilize_data= $('#MonthRangeForm').serializeArray();
        var send_obj = {};
        $.map(serilize_data, function (n, i) {
            send_obj[n['name']] = n['value'];
        });
        console.log(send_obj);
        $('#TimeRange').text("From "+send_obj.st_year+'-'+send_obj.st_mon+" To "
        +send_obj.end_year + '-'+ send_obj.end_month);
        $.ajax({
            url: "/getComponent",
            method: "POST",
            data: send_obj,
            dataType: "json",
            success: function (response) {
                var in_out_obj = {
                    inout_label: response.inout_label,
                    inout_data: response.inout_data,
                };
                var second_obj = {
                    second_label: response.second_label,
                    second_data: response.second_data,
                };
                var third_obj= {
                    third_label: response.third_label,
                    third_data: response.third_data
                };
                console.log(second_obj)

                pieinoutUpdate(in_out_obj);
                piesecondUpdate(second_obj);
                piethirdUpdate(third_obj);
            }
        });
    });
});
