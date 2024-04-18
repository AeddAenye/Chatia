const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const pool = require("./connect.js");


const PORT = 3000;

app.use(express.json());
app.use(require("cors")());

users = [];
connections = [];

io.sockets.on("connection", (socket) => {
    connections.push(socket);
    console.log(`Connected: ${socket.id}`);

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
        res.status(500).json({ success: false, error: error.message });
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
        res.status(501).json({ success: false, error: error.message });
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
        res.status(502).json({ success: false, error: error.message });
        return;
    }


    try {
        const sql ="INSERT INTO chats (ownername, friendname) VALUES ($1, $2)";
        await pool.query(sql, [ownername, friendname]);
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(503).json({ success: false, error: error.message });
    }
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
