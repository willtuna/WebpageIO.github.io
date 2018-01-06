var dataline = {
    labels: [],
    datasets: [
        {
            label: "收入",
            lineTension: .3,
            backgroundColor: "rgba(2,200,10,0.8)",
            borderColor: "rgba(2,200,10,0.8)",
            pointRadius: 5,
            pointBackgroundColor: "rgba(2,200,10,0.8)",
            pointBorderColor: "rgba(255,255,255,0.8)",
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(2,200,10,0.8)",
            pointHitRadius: 20,
            pointBorderWidth: 2,
            data: []
        },
        {
            label: "支出",
            lineTension: .3,
            backgroundColor: "rgba(200,2,20,0.8)",
            borderColor: "rgba(200,2,20,0.8)",
            pointRadius: 5,
            pointBackgroundColor: "rgba(200,2,20,0.8)",
            pointBorderColor: "rgba(255,255,255,0.8)",
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(200,2,20,0.8)",
            pointHitRadius: 20,
            pointBorderWidth: 2,
            data: []
        },
        {
            label: "淨餘額",
            lineTension: .3,
            backgroundColor: "rgba(2,2,200,0.2)",
            borderColor: "rgba(2,2,200,0.8)",
            pointRadius: 5,
            pointBackgroundColor: "rgba(2,2,200,0.2)",
            pointBorderColor: "rgba(255,255,255,0.8)",
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(2,2,200,0.2)",
            pointHitRadius: 20,
            pointBorderWidth: 2,
            data: []
        }
    ]

};
var datapie = {
    labels: [],
    datasets: [{
        label: "Sessions",
        lineTension: .3,
        backgroundColor: "rgba(2,117,216,0.2)",
        borderColor: "rgba(2,117,216,1)",
        pointRadius: 5,
        pointBackgroundColor: "rgba(2,117,216,1)",
        pointBorderColor: "rgba(255,255,255,0.8)",
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(2,117,216,1)",
        pointHitRadius: 20,
        pointBorderWidth: 2,
        data: []
    }]

};
var ctx_line = document.getElementById("dailyLineChart");
var lineChart_g = new Chart(ctx_line, {
    type: 'line',
    data: dataline
});



var ctx_pie = document.getElementById("dailypieChart");
var pieChart_g = new Chart(ctx_pie, {
    type: 'pie',
    data: datapie
});


var lineChartUpdate = function (obj_label_data) {

    lineChart_g.data.labels = [];
    lineChart_g.data.datasets[0].data = [];
    lineChart_g.data.datasets[1].data = [];
    lineChart_g.data.datasets[2].data = [];
    var balance = 0;

    for(var i=0 ; i< obj_label_data.maincategory.length ; ++i){

        lineChart_g.data.labels.push(obj_label_data.date[i]);
        if(obj_label_data.maincategory[i]=='收入'){
            balance = balance + parseInt(obj_label_data.price[i]);
            lineChart_g.data.datasets[0].data.push(obj_label_data.price[i]);
            lineChart_g.data.datasets[1].data.push(0);
            lineChart_g.data.datasets[2].data.push(balance);
        }else{
            balance = balance - parseInt(obj_label_data.price[i]);
            lineChart_g.data.datasets[0].data.push(0);
            lineChart_g.data.datasets[1].data.push(obj_label_data.price[i]);
            lineChart_g.data.datasets[2].data.push(balance);
        }
    }
    lineChart_g.update()
};


var databar = {
    labels: [],
    datasets: [
        {
            label: "收入",
            lineTension: .3,
            backgroundColor: "rgba(2,200,10,0.8)",
            borderColor: "rgba(2,200,10,0.8)",
            pointRadius: 5,
            pointBackgroundColor: "rgba(2,200,10,0.8)",
            pointBorderColor: "rgba(255,255,255,0.8)",
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(2,200,10,0.8)",
            pointHitRadius: 20,
            pointBorderWidth: 2,
            data: []
        },
        {
            label: "支出",
            lineTension: .3,
            backgroundColor: "rgba(200,2,20,0.8)",
            borderColor: "rgba(200,2,20,0.8)",
            pointRadius: 5,
            pointBackgroundColor: "rgba(200,2,20,0.8)",
            pointBorderColor: "rgba(255,255,255,0.8)",
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(200,2,20,0.8)",
            pointHitRadius: 20,
            pointBorderWidth: 2,
            data: []
        }/*,
        {
            label: "淨餘額",
            lineTension: .3,
            backgroundColor: "rgba(2,2,200,0.6)",
            borderColor: "rgba(2,2,200,0.8)",
            pointRadius: 5,
            pointBackgroundColor: "rgba(2,2,200,0.6)",
            pointBorderColor: "rgba(255,255,255,0.8)",
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(2,2,200,0.6)",
            pointHitRadius: 20,
            pointBorderWidth: 2,
            data: []
        }*/
    ]

};

var ctx_bar = document.getElementById("monthlyBarChart");
var barChart_g = new Chart(ctx_bar, {
    type: 'bar',
    data: databar
});
var barChartUpdate = function (obj_label_data) {

    barChart_g.data.labels = [];
    barChart_g.data.datasets[0].data = [];
    //barChart_g.data.datasets[1].data = [];
    //barChart_g.data.datasets[2].data = [];
    var balance = 0;

    for(var i=0 ; i< obj_label_data.month_label.length ; ++i){

        barChart_g.data.labels.push(obj_label_data.month_label[i]);
        barChart_g.data.datasets[0].data.push(obj_label_data.month_income_price[i]);
        barChart_g.data.datasets[1].data.push(obj_label_data.month_outcome_price[i]);
    //    if(obj_label_data.maincategory[i]=='收入'){
    //        balance = balance + parseInt(obj_label_data.price[i]);
    //        lineChart_g.data.datasets[0].data.push(obj_label_data.price[i]);
    //        lineChart_g.data.datasets[1].data.push(0);
    //        lineChart_g.data.datasets[2].data.push(balance);
    //    }else{
    //        balance = balance - parseInt(obj_label_data.price[i]);
    //        lineChart_g.data.datasets[0].data.push(0);
    //        lineChart_g.data.datasets[1].data.push(obj_label_data.price[i]);
    //        lineChart_g.data.datasets[2].data.push(balance);
    //    }
    }
    barChart_g.update()
};

var pieChartUpdate = function (obj_label_data) {

    var bgColor = [];
    for (var i = 0; i < pieChart_g.data.labels.length - 1; i++) {
        bgColor.push('rgba('
            + Math.floor((Math.random() * 255)).toString() + ','
            + Math.floor((Math.random() * 255)).toString() + ','
            + Math.floor((Math.random() * 255)).toString() + ','
            + (Math.random()).toString());
    }

    pieChart_g.data.datasets[0].backgroundColor = bgColor;
    pieChart_g.data.datasets[0].data = obj_label_data.price;
    pieChart_g.data.labels = obj_label_data.date;
    pieChart_g.update()

};
$(document).ready(function () {
    var username = document.cookie.match(/name=.*;?/);
    username = username[0].split('=')[1];
    $("#userName").html('<i class="fa fa-user" aria-hidden="true"></i>&nbsp'+username);

    $('#divmonthBarCard,#divpieChartCard').hide();
    var request = $.ajax({
        url: "/getDaily",
        method: "GET",
        dataType: "json",
        success: function (response) {
            var obj = {
                date: response.date,
                price: response.price,
                maincategory:response.maincategory,
                month_label:response.month_label,
                month_income_price:response.month_income_price
            };
            pieChartUpdate(obj);
            lineChartUpdate(obj);
            barChartUpdate(obj);
        }
    });
    $("#datepickerStart").datepicker();
    $("#datepickerEnd").datepicker();
    $('#dailySubmit').on('click', function (e) {
        $('#divmonthBarCard').show();
        e.preventDefault();
        var dailyrange_arr = $('#dailyRangeForm').serializeArray();
        var send_dailyRange_obj = {};
        $.map(dailyrange_arr, function (n, i) {
            send_dailyRange_obj[n['name']] = n['value'];
        });
        var request = $.ajax({
            url: "/getDaily",
            method: "POST",
            data: send_dailyRange_obj,
            dataType: "json",
            success: function (response) {
                var obj = {
                    date: response.date,
                    price: response.price,
                    maincategory:response.maincategory,
                    month_label:response.month_label,
                    month_income_price:response.month_income_price,
                    month_outcome_price:response.month_outcome_price
                };
                console.log(response.month_label)
                pieChartUpdate(obj);
                lineChartUpdate(obj);
                barChartUpdate(obj);
            }
        });
    });
});
