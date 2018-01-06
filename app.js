var express = require('express');
var bodyparser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'topscientist',
    database: 'expenditureMNG'
});


db.connect(function (err) {
    if (err) {
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
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// body-parser middle ware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use(cookieParser());


//*********   set static path for css js vendor folder ***********
/* set static path , this is the express middleware,
 since express.static the directory is relative to the app.js,
 so we add __dirname for good reference
 we then route the public folder to the  ip:port/static
*/

app.use('/vendor', express.static(__dirname + '/vendor'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
// route handler

app.get('/', function (req, res) {
    res.clearCookie('name');
    res.sendFile(__dirname + '/login.html');
});

app.use('/', express.static(__dirname + '/'));

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
        //console.log(result);
        //console.log(result.length);
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
                //get_all_table(req,res);
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
            // fail
            if (result.length === 0){
                //res.cookie('name', 'express').send('cookie set');
                //console.log('Cookies: ', req.cookies);
                res.sendFile(__dirname+'/login.html');
                //res.send('Hello World!');
            }
            // correct !
            else {
                res.cookie('name', account);
                res.sendFile(__dirname+'/index.html');
            }
        }
    });

});


var cookie_checker = function (req,res,next) {
    var account = req.cookies.name;
    console.log("cookiecheck: account name = " + account);
    sql = "SELECT * FROM User WHERE account = '{{account}}'";
    sql = sql.replace("{{account}}",account);
    console.log(sql);
    query = db.query(sql, function(err, result) {
        if (err)
            throw err;
        else{
            // fail
            if (result.length === 0){
                res.status(403);
                res.render("error",{error:err});
            }
            // correct !
            else {
                console.log("check pass!");
                next();
            }
        }
    });
};


app.use(cookie_checker);


app.get('/table', function (req, res) {
    console.log(req.cookies.name);
    get_all_table(req, res)
});

//*********  GLOBAL VARIABLE ********************
var sql, query, post;

function get_all_table(req, res) {
    var table = req.cookies.name + 'record';
    sql = 'SELECT * FROM ' + table +' ORDER BY ID DESC LIMIT 10';
    query = db.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.render('index', {
            table: result
        });
    })
}

var in_out = ['錯誤', '收入', '支出'];
var income = ['錯誤', '固定收入', '非固定收入'];
var outcome = ['錯誤', '飲食', '交通', '娛樂', '帳單', '醫療', '日用', '其他'];
var eat = ['錯誤', '飲料', '正餐', '點心(宵夜)'];
var transport = ['錯誤', '高鐵', '捷運', '公車', '客運', '加油'];
var tmpdate;

function dateconvert(date) {
    var f_date;
    f_date = date.split('/');
    return f_date [2] + '-' + f_date[0] + '-' + f_date[1];
}

app.post('/addBill', function (req, res) {
    var table = req.cookies.name + "record";

    console.log('FORM SUBMITTED');
    tmpdate = dateconvert(req.body.date);

    var newBill = {
        date: tmpdate,
        maincategory: req.body.maincategory,
        seccategory: req.body.seccategory,
        thirdcategory: req.body.thirdcategory,
        price: req.body.price,
        item_name: req.body.item_name
    };

    if (newBill.maincategory == '1') {
        newBill.maincategory = in_out[1];
        newBill.seccategory = income[newBill.seccategory];
        newBill.thirdcategory = '無';
    }
    else if (newBill.maincategory == '2') {
        if (newBill.seccategory == '1') {
            newBill.maincategory = in_out[2];
            newBill.seccategory = outcome[newBill.seccategory];
            newBill.thirdcategory = eat[newBill.thirdcategory];
        }
        else if (newBill.seccategory == '2') {
            newBill.maincategory = in_out[2];
            newBill.seccategory = outcome[newBill.seccategory];
            newBill.thirdcategory = transport[newBill.thirdcategory];
        }
        else {
            newBill.maincategory = in_out[2];
            newBill.seccategory = outcome[newBill.seccategory];
            newBill.thirdcategory = '無';
        }
    }

    post = newBill;
    sql = 'INSERT INTO '+table+' SET ?';
    query = db.query(sql, post, function (err) {
        if (err) throw  err;
        get_all_table(req, res);
    });
});



app.get('/getTable', function (req, res) {
    var table = req.cookies.name + 'record';
    sql = 'SELECT * FROM '+ table;
    query = db.query(sql, function (err, result) {
        console.log(result);
        if (err) throw err;
        res.render('index', {
            table: result
        });
    })
});



app.all('/getRecent', function (req, res) {
    var table = req.cookies.name + 'record';
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var balance=0;
    var outcome_acc = 0;
    var date_arr = [], price_arr = [];
    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }


    sql = ' SELECT * FROM '+table+' WHERE maincategory = "支出" AND date >= "' +
        yyyy+'-'+mm+'-'+'01'+
        '" AND date <= "'+
        yyyy+'-'+mm+'-'+dd+ '"' ;


    query = db.query(sql, function (err, rows, fields) {
        if (err) throw err;
        console.log("getRecent");
        console.log(rows);
        for (var i = rows.length - 1; i >= 0; i--) {
            if (rows[i].maincategory === '支出') {
                outcome_acc += parseInt(rows[i].price);
                date_arr.push(rows[i].date);
                price_arr.push(rows[i].price);
            }
        }
    });
    sql = " SELECT * FROM "+table+" WHERE  date <= '" + yyyy+'-'+mm+'-'+dd + "'";
    console.log(sql);
    query = db.query(sql, function (err, rows, fields) {
        if (err) throw err;
        balance = 0;
        for (var i = rows.length - 1; i >= 0; i--) {
            if (rows[i].maincategory === '支出') {
                balance -= parseInt(rows[i].price);
            }else if(rows[i].maincategory === '收入'){
                balance += parseInt(rows[i].price);
            }
        }
        if(price_arr.length === 0){
            price_arr = [0];
        }
        console.log(price_arr);
        res.json(
            {
                date: date_arr,
                price: price_arr,
                outcome_acc:outcome_acc,
                balance: balance
            });

    });
});
app.all('/getDaily', function (req, res) {
    var table = req.cookies.name + 'record';
    var start_date = req.body.dateStart;
    var end_date = req.body.dateEnd;
    if ((start_date === undefined) || (end_date === undefined)) {
        console.log('IN DEFAULT DAILY');
        sql = ' SELECT * FROM '+table+' ORDER BY ID DESC LIMIT 7 ';
        query = db.query(sql, function (err, rows, fields) {
            var date_arr = [], price_arr = [], maincategory_arr = [];
            if (err) throw err;
            var i;
            for (i = rows.length - 1; i >= 0; i--) {
                maincategory_arr.push(rows[i].maincategory);
                date_arr.push(rows[i].date);
                price_arr.push(rows[i].price);
            }

            res.json(
                {
                    date: date_arr,
                    price: price_arr,
                    maincategory: maincategory_arr,
                    month_label: month_label_arr,
                    month_income_price: month_income_price_arr,
                    month_outcome_price: month_outcomme_price_arr
                });
        })
    }
    else {
        start_date = start_date.split("/");
        end_date = end_date.split("/");

        var start_year = parseInt(start_date[2]);
        var end_year = parseInt(end_date[2]);
        var start_mon = parseInt(start_date[0]);
        var end_mon = parseInt(end_date[0]);
        end_mon = (end_year - start_year) * 12 + end_mon;
        var month_label_arr = [], month_income_price_arr = [], month_outcomme_price_arr = [];
        var tmpmon;
        for (var j = start_mon; j <= end_mon; j++) {
            if (j % 12 < 10 && (j != 12)) {
                tmpmon = '0' + (j % 12).toString();
            } else {
                if(j%12===0){
                    tmpmon = '12';
                }else{
                    tmpmon = (j % 12).toString();
                }
            }

            sql =
                " SELECT SUM(PRICE) FROM "+ table +" WHERE  maincategory = '收入' AND date LIKE '" +
                start_year.toString() + "-" + tmpmon + "-%'";

            month_label_arr.push(start_year.toString() + "-" + tmpmon);

            query = db.query(sql, function (err, rows, fields) {
                if (err) throw err;
                month_income_price_arr.push(rows[0]['SUM(PRICE)']);
            });


            sql =
                " SELECT SUM(PRICE) FROM "+table+" WHERE  maincategory = '支出' AND date LIKE '" +
                start_year.toString() + "-" + tmpmon + "-%'";

            query = db.query(sql, function (err, rows, fields) {
                if (err) throw err;
                month_outcomme_price_arr.push(rows[0]['SUM(PRICE)']);
            });

            if (j % 12 === 0) {
                start_year++;
            }
        }


        start_date = start_date[2] + '-' + start_date[0] + '-' + start_date[1];
        end_date = end_date[2] + '-' + end_date[0] + '-' + end_date[1];
        sql = " SELECT * FROM " + table + " WHERE date >=  '" + start_date + "' AND date <= '" + end_date + "'";

        query = db.query(sql, function (err, rows, fields) {
            if (err) throw err;
            var i;
            var date_arr = [], price_arr = [], maincategory_arr = [];
            //console.log(sql);
            for (i = 0; i < rows.length; i++) {
                maincategory_arr.push(rows[i].maincategory);
                date_arr.push(rows[i].date);
                price_arr.push(rows[i].price);
            }

            res.json(
                {
                    date: date_arr,
                    price: price_arr,
                    maincategory: maincategory_arr,
                    month_label: month_label_arr,
                    month_income_price: month_income_price_arr,
                    month_outcome_price: month_outcomme_price_arr
                });
        })
    }
});
app.all('/getComponent', function (req, res) {
    var table = req.cookies.name + 'record';
    console.log(req.cookies.name);
    //console.log(req);
    if (Object.keys(req.body).length === 0) {
        console.log("NO DATA FETCH");
    }
    else {
        var start_mon = parseInt(req.body.st_mon);
        var start_year = parseInt(req.body.st_year);
        var end_mon = parseInt(req.body.end_month);
        var end_year = parseInt(req.body.end_year);
        var start_date = req.body.st_year + '-' + req.body.st_mon + '-00';
        var end_date = req.body.end_year + '-' + req.body.end_month + '-31';

        sql =
            " SELECT * FROM `"+ table + "` WHERE date >=  '" + start_date + "' AND date <= '" +
            end_date + "'";

        query = db.query(sql, function (err, rows, fields) {
            if (err) throw err;
            var i;
            var income_sum_val = 0;
            var outcome_sum_val = 0;
            var outcome_obj = ['飲食', '交通', '娛樂', '帳單', '醫療', '日用', '其他'];
            var outcome_val = [0, 0, 0, 0, 0, 0, 0];
            var eat_obj = ['飲料', '正餐', '點心(宵夜)'];
            var eat_val = [0, 0, 0];

            rows.forEach(function (value, index) {
                if (value.maincategory === '收入') {
                    income_sum_val += parseInt(value.price);
                } else if (value.maincategory === '支出') {
                    outcome_sum_val += parseInt(value.price);
                    var index_of_second = outcome_obj.indexOf(value.seccategory);
                    if (index_of_second !== -1) {
                        outcome_val[index_of_second] += parseInt(value.price);
                        if (index_of_second === 0) {
                            var index_of_third = eat_obj.indexOf(value.thirdcategory);
                            eat_val[index_of_third] += parseInt(value.price);
                        } else {
                            console.log("Dirty Data");
                        }
                    } else {
                        console.log("Dirty Data");
                    }
                } else {
                    console.log("Dirty Data");
                }
            });
            console.log(income_sum_val)
            res.json(
                {
                    inout_label: ['收入', '支出'],
                    inout_data: [income_sum_val, outcome_sum_val],
                    second_label: ['飲食', '交通', '娛樂', '帳單', '醫療', '日用', '其他'],
                    second_data: outcome_val,
                    third_label: ['飲料', '正餐', '點心(宵夜)'],
                    third_data: eat_val
                });
        })
    }
});
app.listen(8000, function () {
    console.log('Server Starting on port 8000...');
});
