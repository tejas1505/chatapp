const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const connection = require('../db/db');
const { middleware } = require('../middleware/middleware');
const { executeQuery } = require('../utils/variables');

router.post("/signup", async (req, res) => {
    const { name, email, mobile, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    connection.query(
        "INSERT INTO users (name, email, mobile, password) VALUES (?, ?, ?, ?)",
        [name, email, mobile, hashedPassword],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: "User registered successfully!" });
        }
    );
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    connection.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ error: "User not found!" });

        const user = results[0];
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).json({ error: "Invalid credentials!" });

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY);
        res.json({ success: "Login successful", token, user });
    });
});

router.get('/getUsers', middleware, async (req, res) => {
    try {
        const { user_id } = req.query;

        if (!user_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const data = await executeQuery(
            `select distinct u.id, u.name, u.email, u.mobile, u.is_online, u.last_seen, (select message from messages where (sender_id = u.id and receiver_id = ?) or (sender_id = ? and receiver_id = u.id) order by timestamp desc limit 1) as last_message, (select timestamp from messages where (sender_id = u.id and receiver_id = ?) or (sender_id = ? and receiver_id = u.id) order by timestamp desc limit 1) as last_message_time from users u where u.id in (select sender_id from messages where receiver_id = ? union select receiver_id from messages where sender_id = ?) and u.id != ?;`,
            [user_id, user_id, user_id, user_id, user_id, user_id, user_id]
        );

        const not_seen = await executeQuery(
            `SELECT sender_id, COUNT(*) AS message_count 
            FROM messages 
            WHERE receiver_id = ? AND is_seen = 0 
            GROUP BY sender_id`,
            [user_id]
        );

        const final = data.map(user => {
            const unseenCount = not_seen.find(msg => msg.sender_id === user.id)?.message_count || 0;
            return { ...user, message_count: unseenCount };
        });

        return res.json({ success: "success", data: final });

    } catch (error) {
        console.error("Error in /getUsers:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});


router.get('/search', middleware, async (req, res) => {
    try {
        const { query, user_id } = req.query
        const data = await executeQuery(`select * from users where email like '%${query}%' or mobile like '%${query}%' and id!=?`, [user_id]);
        return res.json({ success: "success", data })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" })
    }
})

router.get('/getUserById', middleware, async (req, res) => {
    try {
        const { user_id } = req.query
        const [data] = await executeQuery(`select * from users where  id=?`, [user_id]);
        return res.json({ success: "success", data })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" })
    }
})

router.get('/getAllUsers', middleware, async (req, res) => {
    try {
        const data = await executeQuery(`select * from users;`);
        return res.json({ success: "success", data })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" })
    }
})

module.exports = router