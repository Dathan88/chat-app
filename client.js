// initializing socket, connection to server
const socket = io.connect('http://localhost:7777');
const $messageForm = $('#messageForm');
const $message = $('#message');
const $chat = $('#chat');
const $messageArea = $('#messageArea');
const $userFormArea = $('#userFormArea');
const $userForm = $('#userForm');
const $users = $('#users');
const $username = $('#username');

socket.on('connect', data => {
	socket.emit('join', 'Hello server from client');
});

$messageForm.submit(e => {
	e.preventDefault();
	socket.emit('send message', $message.val());
	$message.val('');
});

socket.on('new message', data => {
	$chat.append(
		`<div class="card card-body bg-light"><strong>${data.user}</strong> : ${
			data.msg
		}</div>`
	);
});

$userForm.submit(e => {
	e.preventDefault();
	socket.emit('new user', $username.val(), data => {
		if (data) {
			$userFormArea.hide();
			$messageArea.show();
		}
	});
	$username.val('');
});

socket.on('get users', data => {
	let html = '';
	for (let i = 0; i < data.length; i++) {
		html += `<li class="list-group-item">${data[i]}</li>`;
	}
	$users.html(html);
});
