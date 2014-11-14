var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);
var path = require('path');
var fs = require('fs');
console.log('Server running');

var router = express.Router();


router.get('/index.html', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
router.get('/', function(req, res) {
    res.sendFile(__dirname + '/phone.html');
});
router.get('/images.jpg', function(req, res) {
    res.sendFile(__dirname + '/images.jpg');
});

//app.use(express.static(path.join(__dirname, '/')));
app.use('/', router);

server.listen(8888);

//app.get('/',function(req,res){
//    res.redirect('phone.html');
//});
//


var key = {
    arr: []
};
var count = 0;
var i = 0;
var test = 0;
function save(file) {
    //for (var i in key.arr) {
        fs.appendFileSync("SERVER.log",file.toString() , function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
            }
        });
    //}
    //"@NO_"+i+" : "+file+" "
}
// 連線
io.sockets.on('connection', function(socket) {

    // 偵聽 send 事件
    socket.on('send_phone', function(get) {
        key.arr[count] = get.key;
        count++;
        console.log(get.key);
        io.sockets.emit('send_key', {
            key: get.key
        });
        //save(get.key);
    });
    socket.on('run', function(get) {
//        for (var i in key.arr) {
//            console.log('NO_' + i + ' : ' + key.arr[i]);
//            //save(key);
//        }
        setInterval(function() {
            if (i < count * 4) {
                io.sockets.emit('run_phone', {
                    key: key.arr[Math.floor(i / 4)]
                });
                //console.log('NO.' + Math.floor(i/4) + ' : ' + key.arr[Math.floor(i/4)]);
                test++;
                //console.log("test:"+test);
                i++;
            } else {
                i = 0;
                console.log("NO phone");
                test++;
                //console.log("test:"+test);
            }
        }, 200);


    });

    socket.on('send_from_phone', function(data) {

        // 然後我們依據 data.act 做不同的動作
        switch (data.act) {
            // 這個是使用者打開手機網頁後發生的事件
            case "enter":
                io.sockets.emit('get_response', data);
                console.log("Sending getEnter");
                break;

                // 這個是使用者在手機網頁中點擊按鈕，讓電腦網頁背景變色的事件
            case "changebg":
                io.sockets.emit('get_response', data);
                console.log("Sending changeBg");
                break;
        }

    });

});