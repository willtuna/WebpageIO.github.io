var express = require('express');
var bodyparser = require('body-parser');
var path = require('path');
const mysql = require('mysql');

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'topscientist',
    database:'expenditureMNG'
});



db.connect(function (err) {
    if(err){
        throw err;
    }
    console.log("MySQL connected...")
});

var app = express();

/*
var logger = function (req,res,next) {
    console.log("Logging");
    next();
};

app.use(logger);// Should be before route handler
*/

// View Engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

// body-parser middle ware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));



 var users=[
    { id:1,first_name:'Jeff',  last_name:'Michael',email:'jMicahel@gmail.com',age:30 },
    { id:2,first_name:'Sara',  last_name:'Michael',email:'sMicahel@gmail.com',age:40 },
    { id:3,first_name:'Hudson',last_name:'Michael',email:'hMicahel@gmail.com',age:15 } ];



 //*********   set static path for css js vendor folder ***********
/* set static path , this is the express middleware,
 since express.static the directory is relative to the app.js,
 so we add __dirname for good reference
 we then route the public folder to the  ip:port/static
*/

app.use('/vendor',express.static(__dirname+'/vendor'));
app.use('/js',express.static(__dirname+'/js'));
app.use('/css',express.static(__dirname+'/css'));
// route handler

app.get('/',function (req,res) {
    //res.sendFile(__dirname+'/index.html');
    res.sendFile(__dirname+'/login.html');
});
app.use('/',express.static(__dirname+'/'));


app.get('/table',function (req,res) {
    get_all_table(req,res)
});

//*********  GLOBAL VARIABLE ********************
var sql,query,post;
function get_all_table(req,res) {
    sql = 'SELECT * FROM rawData ORDER BY ID DESC LIMIT 10';
    query = db.query(sql, function(err,result){
        if(err) throw err;
        res.render('index',{
            table:result
        });
    })
}
var in_out = ['錯誤','收入','支出']
var income  = ['錯誤','固定收入','非固定收入']
var outcome = ['錯誤','飲食', '交通', '娛樂','帳單','醫療','日用','其他']
var eat     = ['錯誤','飲料','正餐','點心(宵夜)']
var transport = ['錯誤','高鐵','捷運','公車','客運','加油']
var tmpdate;

function dateconvert(date) {
    var f_date;
    f_date = date.split('/');
    return f_date [2] + '-' + f_date[0] + '-' + f_date[1];
}


//*************** post handler for FORM *******************
app.post('/addBill', function (req,res) {
    console.log('FORM SUBMITTED');
    tmpdate = dateconvert(req.body.date);

    var newBill={
        date:tmpdate,
        maincategory:req.body.maincategory,
        seccategory:req.body.seccategory,
        thirdcategory:req.body.thirdcategory,
        price:req.body.price,
        item_name:req.body.item_name
    };

    if(newBill.maincategory == '1'){
       newBill.maincategory = in_out[1];
       newBill.seccategory  = income[newBill.seccategory];
       newBill.thirdcategory = '無';
    }
    else if(newBill.maincategory == '2'){
        if( newBill.seccategory == '1'){
            newBill.maincategory = in_out[2];
            newBill.seccategory  = outcome[newBill.seccategory];
            newBill.thirdcategory = eat[newBill.thirdcategory];
        }
        else if(newBill.seccategory == '2'){
            newBill.maincategory = in_out[2];
            newBill.seccategory  = outcome[newBill.seccategory];
            newBill.thirdcategory = transport[newBill.thirdcategory];
        }
        else {
            newBill.maincategory = in_out[2];
            newBill.seccategory  = outcome[newBill.seccategory];
            newBill.thirdcategory = '無';
        }
    }

        post = newBill;
        sql = 'INSERT INTO rawData SET ?';
        query = db.query(sql, post, function (err,result) {
            if(err) throw  err;
            get_all_table(req,res);
            });
 });


app.get('/getTable', function (req,res) {
    sql = 'SELECT * FROM rawData'
    query = db.query(sql, function(err,result){
        if(err) throw err;
        res.render('index',{
            table:result
        });
    })
});

app.listen(8000,function () {
    console.log('Server Starting on port 8000...');
});


app.get('/getDaily', function (req,res) {
    var start_date = req.body.dateStart;
    var end_date   = req.body.dateEnd;
    var i;
    //   start_date = '2015-01-01';
    //  end_date = '2015-05-01';
    if( (start_date == undefined) || (end_date == undefined)) {
        console.log('IN DEFAULT DAILY');
        sql = ' SELECT * FROM rawData ORDER BY ID DESC LIMIT 7 ' ;
        query = db.query(sql, function(err,rows,fields){
            if(err) throw err;
            var date_arr = [], price_arr = [];
            var i;
            for(i=0 ; i < rows.length ; i++){
                date_arr.push(rows[i].date);
                price_arr.push(rows[i].price);
            }

            res.json( {date:date_arr,price:price_arr} );

        })
    }
    else {
        console.log('FETCH FROM',start_date,'TO',end_date);
        sql =
            " SELECT * FROM `rawData` WHERE date >=  '" + start_date + "' AND date <= '" +
            end_date +"'";

        query = db.query(sql, function(err,rows,fields){
            if(err) throw err;
            var date_arr = [], price_arr = [];
            var i;
            for(i=0 ; i < rows.length ; i++){
                date_arr.push(rows[i].date);
                price_arr.push(rows[i].price);
            }

            res.json( {date:date_arr,price:price_arr} );

        })
    }
});
