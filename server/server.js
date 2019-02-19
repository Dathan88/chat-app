const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
let users = [];
let connections = [];

server.listen(process.env.PORT || 7777);

app.get('/', function(req, res, next) {
	res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'));

// Connect
io.on('connection', socket => {
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);

	// Disconnect
	socket.on('disconnect', data => {
		// if (!socket.username) return;
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s sockets connected', connections.length);
	});

	// Send message
	socket.on('send message', data => {
		io.sockets.emit('new message', { msg: data, user: socket.username });
	});

	// New User
	socket.on('new user', (data, callback) => {
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	});

	function updateUsernames() {
		io.sockets.emit('get users', users);
	}
});
