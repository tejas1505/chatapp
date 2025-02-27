const express = require('express')
const app = express()
const port = 8000
var cors = require('cors');
const connection = require('./db/db');

require('dotenv').config();
app.use(cors())

app.use(express.json())

app.use('/auth', require('./routes/auth'));
app.use('/chats', require('./routes/chats'));
// app.use('/profile_photo/', express.static('profile_photo/'));

const server = app.listen(port, () => {
    console.log(`Listening at ${process.env.BACKEND_URL}`)
})

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL
    },
})


const onlineUsers = new Map();

io.on('connect', (socket) => {
    console.log('A user connected', socket.id);

    socket.on("user:online", (userId) => {
        onlineUsers.set(parseInt(userId), socket.id);
        console.log("User Online", parseInt(userId));

        console.log(onlineUsers);


        connection.query("UPDATE users SET is_online = TRUE WHERE id = ?", [userId]);
        io.emit("update:online:status", { user_id: userId, status: true });
    });


    socket.on("send:message", ({ sender_id, receiver_id, message }) => {
        connection.query("insert into messages (sender_id, receiver_id, message) values (?, ?, ?)", [sender_id, receiver_id, message]);
        console.log({ sender_id, receiver_id, message }, );
        
        if (onlineUsers.has(receiver_id)) {
            console.log("online", onlineUsers.has(receiver_id));
            io.to(onlineUsers.get(receiver_id)).emit("receive:message", { sender_id, receiver_id, message });
        }
    });

    socket.on('user:disconnect', ({ user_id }) => {
        connection.query("UPDATE users SET is_online = 0 WHERE id = ?", [parseInt(user_id)]);
        console.log("User disconnected useeffect", user_id);
        onlineUsers.delete(parseInt(user_id))
        io.emit("user:disconnect", { user_id })
    })

    socket.on('disconnect', (socket) => {
        console.log("User disconnected", socket.id);

    })
});