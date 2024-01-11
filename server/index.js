const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://192.168.1.101:5173",
        methods: ["GET", "POST"],
        transports: ['websocket'],
    },
})

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('set_username', (username) => {
        socket.username = username;
        console.log(`${username} has joined the chat!`);
    });

    socket.on('send_message', ({ text, username, timestamp }) => {
        // Broadcast the message along with the sender's username
        socket.broadcast.emit('receive_message', { text, username, timestamp });
        console.log(socket.id +": "+username + " says '" + text+"'");
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
})

server.listen(8081, () => {
    console.log('Server running on port 8081');
})