app.all('/update_todo', function(req, res) {
    var todo = req.cookies.name + 'todo';
    var text = req.body.text;
    var year = req.body.year;
    var month = req.body.month;
    var day = req.body.day;
    var color = req.body.color;

    var newTodo = {
        dolist: text,
        year: year,
        month: month,
        day: day,
        color: color
    };

    console.log(newTodo);

    sql = 'INSERT INTO '+todo+' SET ?';
    query = db.query(sql, newTodo, function (err) {
        if (err) throw  err;
        // query need to transfer to .js
        sql = ' SELECT * FROM '+todo;
        query = db.query(sql, function (err, rows, fields) {
            var day_arr = [], month_arr = [], year_arr = [];
            var color_arr = [], text_arr = [];
            if (err) throw err;
            var i;
            for (i = rows.length - 1; i >= 0; i--) {
                day_arr.push(rows[i].day);
                month_arr.push(rows[i].month);
                year_arr.push(rows[i].Year);
                color_arr.push(rows[i].color);
                text_arr.push(rows[i].dolist);
            }
            res.json(
                {
                    day: day_arr,
                    month: month_arr,
                    year: year_arr,
                    color: color_arr,
                    note: text_arr
                });
        })
    });
});