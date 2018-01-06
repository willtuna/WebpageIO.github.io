var express = require('express');
var bodyparser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
const mysql = require('mysql');

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'yourpassword',
    database:'yourdatabase'
});

db.connect(function (err) {
    if(err){
        throw err;
    }
    console.log("MySQL connected...")
});

var app = express();

// View Engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

// body-parser middle ware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(cookieParser());

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
    res.clearCookie('name');
    res.sendFile(__dirname+'/login.html');
    //res.cookie('name', 'express').send('cookie set');
});
app.use('/',express.static(__dirname+'/'));

app.get('/table',function (req,res) {
    console.log(req.cookies.name);
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


//*************** post handler for FORM *******************
app.post('/after_regist', function(req, res) {
  console.log('hello');
  var check = false;
  var first = req.body.first_name;
  var last = req.body.last_name;
  var temp = req.body.email;
  var password = req.body.password;
  temp = temp.split("@");
  var account = temp[0];
  var email = temp[1];
  console.log("account:"+account+" email:"+email);
  console.log("first:"+first+" last:"+last);
  console.log("password:"+password);
  //res.sendFile(__dirname+'/index.html');
  check_sql = "SELECT account FROM User WHERE account = '{{query}}'"
  check_sql = check_sql.replace("{{query}}",account);
  // first check duplicate account
  check_query = db.query(check_sql, function (err,result) {
      if(err) throw  err;
      if (result.length !== 0)
        check = true;
      console.log("check!!!"+check);
      if (!check){
        var User={
            account:account,
            password:password,
            email:email,
            first:first,
            last:last
        };
        // if unique insert account info into User table
        sql = "INSERT INTO User SET ?";
        query = db.query(sql, User, function (err,result) {
            if(err) throw  err;
            console.log(err);
            create_todo_sql = "CREATE TABLE {{query}}todo (           \
                        Year int(255) NOT NULL,                       \
                        month int(255) NOT NULL,                      \
                        day int(255) NOT NULL,                        \
                        dolist text NOT NULL,                         \
                        color VARCHAR(100) NOT NULL                   \
                      ) ENGINE=InnoDB DEFAULT CHARSET=utf8";
            create_todo_sql = create_todo_sql.replace("{{query}}",account);
            todo_query = db.query(create_todo_sql, function(err, result_2) {
              if(err)
                throw err;
              else
                console.log("Create todo table "+account+" successful!");
            });
            create_record_sql = "CREATE TABLE {{query}}record (       \
                        maincategory text NOT NULL,                   \
                        seccategory text NOT NULL,                    \
                        thirdcategory text NOT NULL,                  \
                        price text NOT NULL,                          \
                        item_name text NOT NULL,                      \
                        date text NOT NULL,                           \
                        ID int(255) unsigned NOT NULL AUTO_INCREMENT, \
                        PRIMARY KEY (ID)                              \
                      ) ENGINE=InnoDB AUTO_INCREMENT=378 DEFAULT CHARSET=utf8";
            create_record_sql = create_record_sql.replace("{{query}}",account);
            record_query = db.query(create_record_sql, function(err, result) {
              if(err)
                throw err;
              else
                console.log("Create record table "+account+" successful!");
            });
          });
        res.sendFile(__dirname+'/login.html');
      } else {
        res.sendFile(__dirname+'/register.html');
      }
    });
});

app.post('/after_login', function(req, res) {
  var check = false;
  var temp = req.body.email;
  var password = req.body.password;
  temp = temp.split("@");
  var account = temp[0];
  var email = temp[1];
  console.log("account:"+account+" email:"+email);
  console.log("password:"+password);
  sql = "SELECT * FROM User WHERE account = '{{account}}' AND password = '{{password}}' AND email = '{{email}}'";
  sql = sql.replace("{{account}}",account).replace("{{password}}",password).replace("{{email}}",email);
  query = db.query(sql, function(err, result) {
    if (err)
      throw err;
    else{
      // fail !
      if (result.length === 0){
        res.sendFile(__dirname+'/login.html');
      }
      // correct !
      else {
        // create cookie attribute name, and set its value with account
        res.cookie('name', account);
        res.sendFile(__dirname+'/index.html');
      }
    }
  });

});

app.post('/addBill', function (req,res) {
    console.log(req);
    console.log('FORM SUBMITTED');
        var tmpdate =req.body.date;
        tmpdate = tmpdate.split('/');
        tmpdate = tmpdate[2] + '-' + tmpdate[0] + '-' + tmpdate[1];

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
