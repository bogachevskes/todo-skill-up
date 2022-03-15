const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server);

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);
    })
});

server.listen(3005, () => {
    console.log("SERVER RUNNING");
});