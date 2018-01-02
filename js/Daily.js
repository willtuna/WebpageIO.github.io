var data = {
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
var lineChartUpdate = function(obj_label_data) {
    data.datasets[0].data = obj_label_data.data;
    data.labels = obj_label_data.label;
    var ctx = document.getElementById("dailyLineChart");
    new Chart(ctx, {
        type: 'line',
        data: data
    });

};
var pieChartUpdate = function(obj_label_data) {
    data.datasets[0].data = obj_label_data.data;
    data.labels = obj_label_data.label;
    var bgColor = [];
    for(var i =0 ; i < data.labels.length ; i++){
        bgColor.push('rgba('
            +Math.floor((Math.random()*255)).toString()+','
            +Math.floor((Math.random()*255)).toString()+','
            +Math.floor((Math.random()*255)).toString()+','
            + '0.2)');
    }
    console.log(bgColor);
    data.datasets[0].backgroundColor = bgColor;
    var ctx = document.getElementById("dailypieChart");
    new Chart(ctx, {
        type: 'pie',
        data: data
    });

};
$(document).ready( function () {
    var request = $.ajax({
        url: "/getDaily",
        method: "GET",
        dataType: "json",
        success:function(response){
            console.log('GetData',response.date)
            var obj = { label:response.date,
                data:response.price };
            lineChartUpdate(obj);
            pieChartUpdate(obj);
        }
    });
})
