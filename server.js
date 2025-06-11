const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve arquivos estáticos da raiz (./)
app.use(express.static(path.join(__dirname)));

// Rotas explícitas para cada página
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/painel', (req, res) => {
    res.sendFile(path.join(__dirname, 'painel.html'));
});

// Configuração do Socket.io (mantida igual)
io.on('connection', (socket) => {
    console.log('Novo cliente conectado:', socket.id);

    socket.on('comando', (cmd) => {
        io.emit('executar_comando', cmd);
    });

    socket.on('frame_ao_vivo', (frame) => {
        io.emit('frame_ao_vivo', frame);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
