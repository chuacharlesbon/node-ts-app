import express from 'express';
import cors from 'cors';
import myRouter from './app-routes/myRoute';
import dotenv from 'dotenv';
import { DEV_MODE, DEV_WEB_URL, MONGODB_URI_S1, PORT, PROD_WEB_URL } from './config/config';
import productRouter from './app-routes/products';
import cookieParser from 'cookie-parser';
import imageRouter from './app-routes/images';
import mongoose from 'mongoose';
import MongodbRoute from './app-routes/mongodb/ping';
import http from "http";
import { Server } from "socket.io";
import chatUserRouter from './app-routes/chat/userRoutes';

dotenv.config();
const app = express();
const port = PORT ?? 4000;

////////////////////////////
// MONGODB                //
////////////////////////////
const mongoDbUri = MONGODB_URI_S1;
mongoose.connect(mongoDbUri.toString())
.catch(err => {
  console.error("ERR: Initial MongoDB connection error:", err.message);
});;

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error'));
db.once('open', () => console.log('Connected to MongoDB'));

////////////////////////////
// APP SETUP              //
////////////////////////////
app.use(cors({
  origin: DEV_MODE ? DEV_WEB_URL : PROD_WEB_URL,   // Allow this origin only
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
  credentials: true                  // Allow cookies/auth headers if needed
}));

app.use(express.json());
app.use(cookieParser());

////////////////////////////
// ROUTES                 //
////////////////////////////
app.use('/my-route', myRouter);
app.use('/products', productRouter);
// app.use('/products', etagCache, productRouter);
app.use('/images', imageRouter);
app.use('/mongodb', MongodbRoute);

////////////////////////////
// CHAT APP ROUTES        //
////////////////////////////
app.use('/chat', chatUserRouter);

// Default route
app.get("/", (req, res) => {
  res.status(200).send("Node App is on 🚀");
});

//////////////////////////////////////
// Implement
// Socket IO
//////////////////////////////////////
const server = http.createServer(app);
const io = new Server(server, {
  path: "/socket-route", // optional custom path
  cors: {
    origin: "*", // DEV_MODE ? DEV_WEB_URL : PROD_WEB_URL,
  },
});

const users = new Map(); // better than {}
// const users = {}; // Store userId -> socket.id mapping

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Flutter -> Node (listen to events)
  socket.on("client-message", (data) => {
    console.log("📩 From Flutter:", data);

    // Send acknowledgement
    socket.emit("server-ack", { status: "received", echo: data });
  });

  // Example: Node -> Flutter (broadcast)
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    // Notify only users in that room
    io.to(roomId).emit("room-notice", {
      message: `User ${socket.id} joined room ${roomId}`,
    });
  });

  // Store userId when a user joins
  socket.on("register", (userId) => {
    // users[userId] = socket.id;  // Map userId to socket.id
    users.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ID ${socket.id}`);
  });

  // Send message to a specific user
  socket.on("private-message", ({ recipientId, message }) => {
    const recipientSocketId = users.get(recipientId); // Get socket ID of the recipient
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("message", { senderId: socket.id, message });
      console.log(`Sent message to user ${recipientId}: ${message}`);
    } else {
      console.log(`User ${recipientId} is not online.`);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    // Remove the user from the mapping
    // for (let userId in users) {
    //     if (users[userId] === socket.id) {
    //         console.log(`User ${userId} disconnected from socket`);
    //         delete users[userId];
    //         break;
    //     }
    // }
    for (const [userId, id] of users) {
      if (id === socket.id) {
        users.delete(userId);
        break;
      }
    }
  });

  socket.on("msg", (data) => {
    console.log("Message from client:", data);
    socket.emit("fromServer", "Hello from Node.js server");
  });
});

server.listen(port, () => console.log(`Server + Socket is now running at port ${port}`))