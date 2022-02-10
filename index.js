const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let users = [];
let socketIds = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
    console.log(req);
});

io.on('connection', socket => {
    socket.on('new user', data => {
        if(users.indexOf(data) !== -1) {
            socket.emit('new user', { success: false });
        } else {
            users.push(data);
            socketIds.push(socket.id);
            socket.emit('new user', { success: true });
            //Emit para os outros usuários dizendo que tem um novo usuário ativo.
        }
    });
    socket.on('chat message', obj => {
        if(users.indexOf(obj.nome) !== -1 && users.indexOf(obj.nome) === socketIds.indexOf(socket.id)){
            io.emit('chat message', obj);
        } else {
            console.log('Erro: Você não tem permissão para executar a ação.');
        }
    });
    socket.on('disconnect', () => {
        let id = socketIds.indexOf(socket.id);
        socketIds.splice(id, 1);
        users.splice(id, 1);
        console.log('user disconnected');
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});