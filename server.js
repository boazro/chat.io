var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/styles.css', function(req, res) {
    res.sendFile(__dirname + '/styles.css');
});
app.get('/scripts.js', function(req, res) {
    res.sendFile(__dirname + '/scripts.js');
});

const users = [{
        id: 1,
        name: 'Scooby doo',
        connected: false
    },
    {
        id: 2,
        name: 'Norville "Shaggy" Rogers',
        connected: false
    }
]

io.on('connection', function(socket) {

    const user = users.find(user => !user.connected);

    if (user) {
        user.connected = true;
        socket.user = user;
        console.log('User connected: ', user.name);

        io.emit('new chat', { username: socket.user.name });

        socket.on('chat message', function(msg) {
            io.emit('chat message', {
                text: msg,
                username: user.name,
                time: moment().format('hh:mm')
            });
        });
        socket.on('disconnect', function() {
            socket.user.connected = false;
        });
    }
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});