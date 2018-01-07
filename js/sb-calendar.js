(function($) {
  "use strict"; // Start of use strict
  // Configure tooltips for collapsed side navigation
  $('.navbar-sidenav [data-toggle="tooltip"]').tooltip({
    template: '<div class="tooltip navbar-sidenav-tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
  })
  // Toggle the side navigation
  $("#sidenavToggler").click(function(e) {
    e.preventDefault();
    $("body").toggleClass("sidenav-toggled");
    $(".navbar-sidenav .nav-link-collapse").addClass("collapsed");
    $(".navbar-sidenav .sidenav-second-level, .navbar-sidenav .sidenav-third-level").removeClass("show");
  });
  // Force the toggled class to be removed when a collapsible nav link is clicked
  $(".navbar-sidenav .nav-link-collapse").click(function(e) {
    e.preventDefault();
    $("body").removeClass("sidenav-toggled");
  });
  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .navbar-sidenav, body.fixed-nav .sidenav-toggler, body.fixed-nav .navbar-collapse').on('mousewheel DOMMouseScroll', function(e) {
    var e0 = e.originalEvent,
      delta = e0.wheelDelta || -e0.detail;
    this.scrollTop += (delta < 0 ? 1 : -1) * 30;
    e.preventDefault();
  });
  // Scroll to top button appear
  $(document).scroll(function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });
  // Configure tooltips globally
  $('[data-toggle="tooltip"]').tooltip()
  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    event.preventDefault();
  });
})(jQuery); // End of use strict

var mod1 = document.getElementById("canvas-module1"); // get width & height from canvas
var ctx1 = mod1.getContext("2d");

var month=['JANUARY','FEBURARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBOR','NOVEMBER','DECEMBER']
var week = ['SUN','MON','TUE','WED','THU','FRI','SAT']; 

var year=2018;
var mon=1;
var mon_tot=[31,28,31,30,31,30,31,31,30,31,30,31];

var get_day=[2,5,6,15,30];
var get_month=[1,1,2,3,4];
var get_year=[2018,2018,2018,2018,2018];
var get_color=["#FF0000","#0080FF","#563d7c","#563d7c","#563d7c"];
var length=5;



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//main function

drawmod1();

draw_color(get_day,get_month,get_year,get_color);


function mon_first(year,mon) {
    var mon_day=[0,3,3,6,1,4,6,2,5,0,3,5];
	
	if(mon<1){
	
	temp = parseInt(year+year/4+year/400-year/100+(mon_day[12-Math.abs(mon%12)-1]+1)-1)%7;
	}
	else
	temp = parseInt(year+year/4+year/400-year/100+(mon_day[(mon-1)%12]+1)-1)%7;
     
	return temp;
}


function last_month() {
    ctx1.clearRect(0, 0, mod1.width, mod1.height);
	if(((mon-1)%12)==0){
	year=year-1;
	}
	mon = mon-1;
	drawmod1();
	draw_color(get_day,get_month,get_year,get_color);
}

function next_month() {
    ctx1.clearRect(0, 0, mod1.width, mod1.height);
	if(((mon%12)==0)){
	year =year+1;	
	mon = mon+1;
    }
	else
	mon = mon+1;
	drawmod1();
	draw_color(get_day,get_month,get_year,get_color);
	
}

///////////100+42*(9-mod1_cell[3*choose_month].length)//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function drawmod1() {
	
	
//	switch (mod1_cell[3*choose_month]) {
		
	//ctx.font = "180px  Arial"; ctx.fillStyle = "rgba(0,0,0,0.15)"; ctx.fillText(mod1_cell[3*choose_month],75,390);  // month in the middle
	if(mon<1){
		ctx1.font = "60px  Arial"; ctx1.fillStyle = "rgba(0,100,100,0.5)"; ctx1.fillText(month[12-Math.abs(mon%12)-1],500-(ctx1.measureText(month[12-Math.abs(mon%12)-1]).width)-20,550);
	}
	else{
		ctx1.font = "60px  Arial"; ctx1.fillStyle = "rgba(0,100,100,0.5)"; ctx1.fillText(month[(mon-1)%12],500-(ctx1.measureText(month[(mon-1)%12]).width)-20,550);  // month at the coner
	}   
	k=1;
	  for(var j=1;j<7;++j){
		if(j==1){
			for(var i=mon_first(year,mon);i<7;i++){  // give the week at month-1  use year & month to calculate
				ctx1.font = "20px  Arial";  ctx1.fillStyle = "black"; ctx1.fillText(k,15+i*70,20+j*83);
				k++;
			}
		}
		else{
			for(var i=0;i<7;i++){
				
			if(mon<1){
				if(k>mon_tot[12-Math.abs(mon%12)-1]){ // give the total day in that month 
					break;}
				}
		    else{
				if(k>mon_tot[(mon-1)%12]){ // give the total day in that month 
				break;}
				}
				ctx1.font = "20px  Arial";  ctx1.fillStyle = "black"; ctx1.fillText(k,15+i*70,20+j*83);
				k++;
			
			}
		}
	  }
	
	ctx1.beginPath();
	ctx1.rect(0, 0, 500, 70); 
	//ctx1.fillStyle = "lightsteelblue";
	ctx1.fillStyle ="rgba(62, 61, 153, 0.3)";
	ctx1.fill(); 
	
	
	
	
	for(var i=0 ; i<7 ; i++){
			
		if(i==0 || i==6){
			ctx1.font = "20px  Arial";  
			ctx1.fillStyle = "white";
			ctx1.fillText(week[i],20+70*i,40);
		}
		else{
			ctx1.font = "20px  Arial";  
			ctx1.fillStyle = "white";
			ctx1.fillText(week[i],20+70*i,40);
		}
	}
	
	
	for(var i=0 ; i<7 ; i++){
		for(var j=0 ; j<6 ; j++){
			ctx1.beginPath();
			ctx1.rect(10+i*70, 80+j*83, 60 ,75 ); 
			ctx1.fillStyle = "rgba(0,0,0,0.15)";	
			ctx1.fill();
			
		}
	}
		
}	



function draw_color(get_day,get_month,get_year,get_color) {
	var tran_mon=0;
	var mon_true=[1,2,3,4,5,6,7,8,9,10,11,12];
	if(mon<1){
		tran_mon= mon_true[12-Math.abs(mon%12)-1];
	}
	else{
		tran_mon= mon_true[(mon-1)%12];
	}
	for(scan=0;scan<length;++scan){
		
		if(get_year[scan]==year && get_month[scan]==tran_mon){	
		    
		    	
			var k=1;
			for(var j=1;j<7;++j){
				if(j==1){
					for(var i=mon_first(year,mon);i<7;i++){  // give the week at month-1  use year & month to calculate
						if(k==get_day[scan]){
						ctx1.font = "30px  Arial";  ctx1.fillStyle = get_color[scan]; ctx1.fillText('▼',25+i*70,50+j*83);
						}
						k++;
						console.log(k);
					}
				}
				else{
					for(var i=0;i<7;i++){
						
					if(mon<1){
						if(k>mon_tot[12-Math.abs(mon%12)-1]){ // give the total day in that month 
							break;}
						}
					else{
						if(k>mon_tot[(mon-1)%12]){ // give the total day in that month 
						break;}
						}
						if(k==get_day[scan]){
						ctx1.font = "30px  Arial";  ctx1.fillStyle = get_color[scan]; ctx1.fillText('▼',25+i*70,50+j*83);
						}
						k++;
					
					}
				}
			}
		}		
	}
}	

$(document).ready(function () {

        $.ajax({
            url: "/get_date",
            method: "POST",
            data: send_obj,
            dataType: "json",
            success: function (response) {
                var color = response.color;
				var day = response.day;
				var month = response.month;
				var year = response.year;
				draw_color(day,month,year,color);
				
				
            }
        });


    $('#submit').on('click', function (e) {
        e.preventDefault();
        var serilize_data= $('#todolist').serializeArray();
        var send_obj = {};
        $.map(serilize_data, function (n, i) {
            send_obj[n['name']] = n['value'];
        });
        $.ajax({
            url: "/get_date",
            method: "POST",
            data: send_obj,
            dataType: "json",
            success: function (response) {
                var color = response.color;
				var day = response.day;
				var month = response.month;
				var year = response.year;
				draw_color(day,month,year,color);
				
				
            }
        });
    });
});
	