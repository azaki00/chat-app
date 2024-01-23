const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const os = require("os");

app.use(cors());

// Get the local IP address dynamically
const networkInterfaces = os.networkInterfaces();
let localIpAddress;

// Loop through network interfaces to find the first non-internal IPv4 address
Object.keys(networkInterfaces).forEach((key) => {
    const interfaceList = networkInterfaces[key];
    for (const iface of interfaceList) {
        if (!iface.internal && iface.family === 'IPv4') {
            localIpAddress = iface.address;
            break;
        }
    }
    if (localIpAddress) {
        return; // Stop iterating if we found an address
    }
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: `http://${localIpAddress}:5173`,
        methods: ["GET", "POST"],
        transports: ['websocket'],
    },
});

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
});

server.listen(8081, () => {
    console.log('Server running on port 8081');
    console.log(`Server accessible at http://${localIpAddress}:8081`);
});
