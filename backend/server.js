const express = require("express");
const app = express();

app.use(require("cors")());
app.use(express.json());

const pool = require("./connect.js");

const PORT = 3000;

app.post('/api/login', async (req, res) => {
    console.log('Вход в функцию login');

    const { username, password } = req.body

    const data = await pool.query("SELECT username, passwd_hash FROM users WHERE username = $1", [username])
    

    if (data.rows.length == 0) {
        const reg = await pool.query("INSERT INTO users (username, passwd_hash) VALUES ($1, $2)", [username, password])
        res.status(201).json({ success: true })
        return
    }

    if (data.rows[0].passwd_hash != password) {
        res.status(401).json({ success: false })
        return
    }
    res.status(200).json({ success: true })
    return
})


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
