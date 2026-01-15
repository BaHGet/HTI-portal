const { Server } = require("socket.io");
const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");

let io;

const initSocket = async (server) => {
  if (io) return io;
  
  const pubClient = createClient({ url: process.env.REDIS_URL});
  const subClient = pubClient.duplicate();

  await Promise.all([pubClient.connect(), subClient.connect()]);

  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL, 
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.adapter(createAdapter(pubClient, subClient));

  console.log("Socket.io with Redis Adapter initialized! 🌐");
  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};

module.exports = { initSocket, getIO };