const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve os arquivos HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/painel', (req, res) => {
    res.sendFile(__dirname + '/painel.html');
});

// Gerencia conexões Socket.io
io.on('connection', (socket) => {
    console.log('Novo cliente conectado:', socket.id);

    // Painel -> Dispositivo (comandos)
    socket.on('comando', (cmd) => {
        io.emit('executar_comando', cmd); // Broadcast para todos os dispositivos
    });

    // Dispositivo -> Painel (frames da câmera)
    socket.on('frame_ao_vivo', (frame) => {
        io.emit('frame_ao_vivo', frame); // Envia para todos os painéis
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
