var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/styles.css', function(req, res) {
    res.sendFile(__dirname + '/styles.css');
});

let usersCounter = 0;

io.on('connection', function(socket) {
    socket.username = `user-${++usersCounter}`;
    console.log('a user connected: ' + socket.username);

    io.emit('new user', { username: socket.username, time: new Date() });

    socket.on('chat message', function(msg) {
        io.emit('chat message', {
            msg: msg,
            user: socket.username
        });
    });
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});