const express = require('express')
const router = express.Router();

const connection = require('../db/db');
const { middleware } = require('../middleware/middleware');
const { executeQuery } = require('../utils/variables');

router.get('/getMessages', middleware, async (req, res) => {
    try {
        const { sender_id, receiver_id } = req.query
        const messages = await executeQuery(`select * from messages where (receiver_id=? and sender_id=?) or (receiver_id=? and sender_id=?) order by id;`, [receiver_id, sender_id, sender_id, receiver_id]);
        return res.json({ success: "success", messages })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" })
    }
})

router.post('/saveMessage', middleware, async (req, res) => {
    try {
        const { sender_id, receiver_id, message } = req.body

        const insertQuery = `insert into messages (sender_id, receiver_id, message) values (?, ?, ?);`
        connection.query(insertQuery, [sender_id, receiver_id, message], (err, data) => {
            if (err) {
                console.log(err);

                return res.status(400).json({ error: "Error saving message" })
            }
            return res.json({ success: "success", data })
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" })
    }
})

router.post('/seenMessage', middleware, async (req, res) => {
    try {
        const { sender_id, receiver_id } = req.body

        const insertQuery = `update messages set is_seen='1' where sender_id=? and receiver_id=?;`
        connection.query(insertQuery, [sender_id, receiver_id], (err, data) => {
            if (err) {
                console.log(err);

                return res.status(400).json({ error: "Error saving message" })
            }
            return res.json({ success: "success", data })
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" })
    }
})


module.exports = router