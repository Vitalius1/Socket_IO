var express = require("express");
var path = require("path");
var querystring = require("querystring");

var app = express();
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

var messages = {allMessages:[]};
var users = {allUsers:[]};

function exist(name){
    for(let i = 0; i < users.allUsers.length; i++){
        if(users.allUsers[i].name == name){
            return true;
        }
    }
    return false;
}

app.get('/', function (req, res) {
    res.render("index");
});

var server = app.listen(8000, function () {
    console.log("listening on port 8000");
});
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    console.log("Client/socket is connected!");
    console.log("Client/socket id is: ", socket.id);
    
    socket.on("check_if_user_exist", function(data){
        if(exist(data.name)){
            socket.emit("allready_exists");
        }
        else{
            users.allUsers.push({name: data.name});
            socket.name = data.name;
            socket.emit("get_messages", messages);
        }
    });

    socket.on("posting_message", function(data){
        // console.log(socket);
        var msg = querystring.parse(data);
        messages.allMessages.push({content:msg.msg, creator:socket.name});
        io.emit("new_message", {content:msg.msg, creator:socket.name, id:socket.id});
    });
});
