const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
      }
);

// Check database connection and log detailed errors
pool.connect()
  .then(() => console.log('Connected to the database successfully'))
  .catch((err) => {
    console.error('Error connecting to the database:');
    console.error('Message:', err.message);
    console.error('Stack:', err.stack);
    process.exit(1); // Exit the process if the connection fails
  });

app.use(cors());
app.use(express.json());

// Get all links
app.get('/api/links', async (req, res) => {
  const result = await pool.query('SELECT * FROM links');
  res.json(result.rows);
});

// Add a new link
app.post('/api/links', async (req, res) => {
  const { title, url, description } = req.body;
  const result = await pool.query(
    'INSERT INTO links (title, url, description) VALUES ($1, $2, $3) RETURNING *',
    [title, url, description]
  );
  res.json(result.rows[0]);
});

// Update a link
app.put('/api/links/:id', async (req, res) => {
  const { id } = req.params;
  const { title, url, description } = req.body;
  const result = await pool.query(
    'UPDATE links SET title = $1, url = $2, description = $3 WHERE id = $4 RETURNING *',
    [title, url, description, id]
  );
  res.json(result.rows[0]);
});

// Delete a link
app.delete('/api/links/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM links WHERE id = $1', [id]);
  res.sendStatus(204);
});

app.listen(5000, () => console.log('Server running on port 5000'));
