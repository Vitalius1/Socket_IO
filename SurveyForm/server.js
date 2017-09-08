// var session = require('express-session');

var querystring = require("querystring");
var express = require("express");
var path = require("path");
var app = express();
// var bodyParser = require('body-parser');
// app.use(session({secret: 'codingdojorocks'}));  // string for encryption
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./static")));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');


// root route to render the index.ejs view
app.get('/', function (req, res) {
    res.render("index");
});


// tell the express app to listen on port 8000
var server = app.listen(8000, function () {
    console.log("listening on port 8000");
});
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    console.log("Client/socket is connected!");
    console.log("Client/socket id is: ", socket.id);

    socket.on("posting_form", function(data){
        var result = querystring.parse(data);
        socket.emit("updated_message", result);
        socket.emit("random_number", {num: Math.floor(Math.random()*1001)});
    });
});
  