const { Server } = require("socket.io");
const UserSocket = require('../model/UserSocket');

let ioInstance;

module.exports = (server) => {
    const io = new Server(server, {
        cors: { origin: "http://localhost:8080" },
    });

    ioInstance = io;

    io.on("connection", async (socket) => {
        console.log("Client connected:", socket.id);

        socket.on("register", async (userId) => {
            if (!userId) return;

            await UserSocket.findOneAndUpdate(
                { userId },
                { socketId: socket.id },
                { upsert: true, new: true }
            )

            console.log(`User ${userId} connected with socket ID ${socket.id}`);
        });

        socket.on("disconnect", async () => {
            console.log("Client disconnected:", socket.id);
            await UserSocket.findOneAndDelete({ socketId: socket.id})
        });
    });

    return io;
}

module.exports.ioInstance = () => ioInstance;