var mysql2 = require('mysql2')
var connection = mysql2.createPool({
    host: 'localhost', // Use your mysql host
    user: 'root', // Use your mysql username
    password: '4557', // Use your mysql password
    database: 'chatapp', // Use your mysql database name
})


connection.getConnection((err) => {
    if (err) {
        console.log(err)
        return
    }
    console.log('Database connected')
})



module.exports = connection;