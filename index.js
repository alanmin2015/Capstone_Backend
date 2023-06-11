
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || '5000';

const db = mysql.createPool({
    host: 'wenbomin.ca',
    user: 'hekapmc2_Alan',
    password: 'Dm852833480',
    database: 'hekapmc2_Spa'
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: '*' }));

app.get('/api/users', async (req, res) => {
    db.getConnection((err, conn) => {
        if (err) {
            console.log(`Cannot connect to database: ${err}`);
            res.status(500).send({ error: 'Error connecting to db' });
        } else {
            conn.query('SELECT * FROM users', (err, results) => {
                if (err) {
                    console.log(err);
                    res.status(500).send({ error: 'Error fetching data from db' });
                } else {
                    res.json(results);
                }
                conn.release(); //release the connection back to the pool
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});
