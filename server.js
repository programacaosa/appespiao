const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000;

// Servir arquivos da raiz
app.use(express.static(__dirname));

// Rota do dispositivo
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Rota do painel
app.get('/painel', (req, res) => {
    res.sendFile(__dirname + '/painel.html');
});

// Conexões socket
io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    // Painel envia comando
    socket.on('comando', (cmd) => {
        console.log('Comando recebido:', cmd);
        io.emit('executar_comando', cmd);
    });

    // Dispositivo envia vídeo para o painel
    socket.on('video_gravado', (videoBase64) => {
        console.log('Vídeo recebido do dispositivo.');
        io.emit('video_recebido', videoBase64);
    });

    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Servidor rodando: http://localhost:${PORT}`);
    console.log(`Painel: http://localhost:${PORT}/painel`);
});
