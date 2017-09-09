// var bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "./static")));
// var session = require('express-session');
// app.use(session({secret: 'codingdojorocks'}));  // string for encryption
var express = require("express");
var path = require("path");
var app = express();
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

var count = 0;
// root route to render the index.ejs view
app.get('/', function (req, res) {
    res.render("index", {count:count});
});


// tell the express app to listen on port 8000
var server = app.listen(8000, function () {
    console.log("listening on port 8000");
});
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    console.log("Client/socket is connected!");
    console.log("Client/socket id is: ", socket.id);
    
    socket.on("addone", function(){
        count ++;
        io.emit("res", {num: count});
    });
    socket.on("addtwo", function(){
        count += 2;
        io.emit("res", {num: count});
    });
    socket.on("reset", function(){
        count = 0;
        io.emit("res", {num: count});
    });
});
