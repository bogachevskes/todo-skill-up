const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server);

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('send_message', (data) => {
        console.log(`User sent a message:`, data);

        socket.emit('receive_message', 'hi client');
    });

    socket.on('join_room', (data) => {
        
        console.log(`User ${socket.id} joined a room`);

    });

    setInterval(function() {
        socket.emit('receive_message', 'are you okey?');

        console.log('sent check to client');
    }, 3000);

    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);
    })
});

server.listen(3005, () => {
    console.log("SERVER RUNNING");
});