const express = require("express");
const app = express();
const server = require("http").createServer(app);
const pool = require("./connect.js");
const io = require('socket.io')(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

const PORT = 3000;

app.use(express.json());
app.use(require("cors")());

users = [];
connections = [];

io.sockets.on("connection", (socket) => {
    connections.push(socket);
    console.log(`Connected: ${socket.id}`);

    socket.on("authenticate", (username) => {
        console.log(`User '${username}' authenticated, socket ID: ${socket.id}`);
        users[username] = socket.id;
    });

    socket.on("disauthenticate", (username) => {
        console.log(`User '${username}' disauthenticated, socket ID: ${socket.id}`);
        delete users[username];
    });

    socket.on("newchat", (data) => {
        console.log("New chat emit", data);
        io.to(users[data.ownername]).emit("newchat");
        io.to(users[data.friendname]).emit("newchat");
    });

    socket.on("openchat", (data) => {
        console.log("Open chat emit", data);
        io.to(users[data.ownername]).emit("newmessage");
        io.to(users[data.friendname]).emit("newmessage");
    })

    socket.on("newmessage", (data) => {
        console.log("New message emit", data);
        io.to(users[data.ownername]).emit("newmessage");
        io.to(users[data.friendname]).emit("newmessage");
    });

    socket.on("disconnect", () => {
        connections.splice(connections.indexOf(socket), 1);
        console.log(`Disconnected: ${socket.id}`);
    }); 
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const sql = "SELECT username, passwd_hash FROM users WHERE username = $1";
        const data = await pool.query(sql, [username]);
        
        if (data.rows.length === 0) {
            const sql = "INSERT INTO users (username, passwd_hash) VALUES ($1, $2)";
            await pool.query(sql, [username, password]);
            res.status(201).json({ success: true });
            return;
        }

        if (data.rows[0].passwd_hash !== password) {
            res.status(401).json({ success: false, message: 'Неверный пароль' });
            return;
        }

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(404).json({ success: false, message: "Не удалось войти" });
    }
});

app.get('/api/chats', async (req, res) => {
    try {
        const sql = "SELECT * FROM chats WHERE ownername = $1 OR friendname = $1";
        const data = await pool.query(sql, [req.query.username]);
        res.status(200).json({ success: true, chats: data.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/newchat', async (req, res) => {
    const { ownername, friendname } = req.body;

    try {
        const sql = "SELECT * FROM users WHERE username = $1";
        const data = await pool.query(sql, [friendname]);
        if (data.rows.length === 0) {
            res.status(404).json({ success: false, message: 'Пользователь не найден' });
            return;
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
        return;
    }


    try {
        const sql = "SELECT * FROM chats WHERE ownername = $1 AND friendname = $2 OR ownername = $2 AND friendname = $1";
        const data = await pool.query(sql, [ownername, friendname]);
        if (data.rows.length > 0) {
            res.status(409).json({ success: false, message: 'Чат уже существует' });
            return;
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
        return;
    }


    try {
        const sql ="INSERT INTO chats (ownername, friendname) VALUES ($1, $2)";
        await pool.query(sql, [ownername, friendname]);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }

    try{
        sql = "SELECT * FROM chats WHERE ownername = $1 AND friendname = $2";
        const data = await pool.query(sql, [ownername, friendname]);
        res.status(200).json({ success: true, chats: data.rows})
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/newmessage', async (req, res) => {
    const { ownername, friendname, message, chat_id } = req.body;

    try{
        const sql = "INSERT INTO messages (ownername, friendname, message, chat_id, send_time) VALUES ($1, $2, $3, $4, NOW())";
        await pool.query(sql, [ownername, friendname, message, chat_id]);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
})

app.get('/api/chatmessages', async (req, res) => {
    try {
        const sql = "SELECT * FROM messages WHERE chat_id = $1";
        const data = await pool.query(sql, [req.query.chat_id]);
        res.status(200).json({ success: true, messages: data.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
})

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
