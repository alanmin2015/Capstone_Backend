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
        conn.release(); // Release the connection back to the pool
      });
    }
  });
});

app.get('/api/users/:userId', async (req, res) => {
  const { userId } = req.params;
  db.getConnection((err, conn) => {
    if (err) {
      console.log(`Cannot connect to database: ${err}`);
      res.status(500).send({ error: 'Error connecting to db' });
    } else {
      conn.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).send({ error: 'Error fetching data from db' });
        } else {
          res.json(results[0]); // Return only the first user matching the id
        }
        conn.release(); // Release the connection back to the pool
      });
    }
  });
});

app.post('/api/users', async (req, res) => {
  const { email, password } = req.body;

  db.getConnection((err, conn) => {
    if (err) {
      console.log(`Cannot connect to database: ${err}`);
      res.status(500).send({ error: 'Error connecting to db' });
    } else {
      conn.query('INSERT INTO users SET ?', { email, password }, (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).send({ error: 'Error adding user to db' });
        } else {
          res.status(201).send({ message: 'User created successfully' });
        }
        conn.release();
      });
    }
  });
});


app.put('/api/users/:userId', async (req, res) => {
  const { userId } = req.params;
  const { password, first, last } = req.body;
  db.getConnection((err, conn) => {
    if (err) {
      console.log(`Cannot connect to database: ${err}`);
      res.status(500).send({ error: 'Error connecting to db' });
    } else {
      conn.query(
        'UPDATE users SET password = ?, first = ?, last = ? WHERE id = ?',
        [password, first, last, userId],
        (err, results) => {
          if (err) {
            console.log(err);
            res.status(500).send({ error: 'Error updating user in db' });
          } else {
            res.status(200).send({ message: 'User updated successfully' });
          }
          conn.release();
        }
      );
    }
  });
});

app.delete('/api/users/:userId', async (req, res) => {
  const { userId } = req.params;

  db.getConnection((err, conn) => {
    if (err) {
      console.log(`Cannot connect to database: ${err}`);
      res.status(500).send({ error: 'Error connecting to db' });
    } else {
      conn.query('DELETE FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).send({ error: 'Error deleting user from db' });
        } else {
          res.status(200).send({ message: 'User deleted successfully' });
        }
        conn.release();
      });
    }
  });
});

app.get('/api/booking', async (req, res) => {
  db.getConnection((err, conn) => {
    if (err) {
      console.log(`Cannot connect to database: ${err}`);
      res.status(500).send({ error: 'Error connecting to db' });
    } else {
      conn.query('SELECT * FROM booking', (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).send({ error: 'Error fetching data from db' });
        } else {
          res.json(results);
        }
        conn.release(); // Release the connection back to the pool
      });
    }
  });
});

app.post('/api/booking', async (req, res) => {
  const { date, people, userID } = req.body;

  db.getConnection((err, conn) => {
    if (err) {
      console.log(`Cannot connect to database: ${err}`);
      res.status(500).send({ error: 'Error connecting to db' });
    } else {
      conn.query(
        'INSERT INTO booking (date, people, userID) VALUES (?, ?, ?)',
        [date, people, userID],
        (err, results) => {
          if (err) {
            console.log(err);
            res.status(500).send({ error: 'Error adding booking to db' });
          } else {
            res.status(201).send({ message: 'Booking created successfully' });
          }
          conn.release();
        }
      );
    }
  });
});

app.put('/api/booking/:id', async (req, res) => {
  const { id } = req.params;
  const { date, people, userID } = req.body;

  db.getConnection((err, conn) => {
    if (err) {
      console.log(`Cannot connect to database: ${err}`);
      res.status(500).send({ error: 'Error connecting to db' });
    } else {
      conn.query(
        'UPDATE booking SET date = ?, people = ?, userID = ? WHERE id = ?',
        [date, people, userID, id],
        (err, results) => {
          if (err) {
            console.log(err);
            res.status(500).send({ error: 'Error updating booking in db' });
          } else {
            res.status(200).send({ message: 'Booking updated successfully' });
          }
          conn.release();
        }
      );
    }
  });
});

app.delete('/api/booking/:id', async (req, res) => {
  const { id } = req.params;

  db.getConnection((err, conn) => {
    if (err) {
      console.log(`Cannot connect to database: ${err}`);
      res.status(500).send({ error: 'Error connecting to db' });
    } else {
      conn.query('DELETE FROM booking WHERE id = ?', [id], (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).send({ error: 'Error deleting booking from db' });
        } else {
          res.status(200).send({ message: 'Booking deleted successfully' });
        }
        conn.release();
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
