require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'movies_db'
});

// Get all movies
app.get('/movies', async (req, res) => {
    try {
        const [movies] = await db.query('SELECT * FROM movies');
        res.json(movies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new movie
app.post('/movies', async (req, res) => {
    const { title, director, genre, release_year, rating } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO movies (title, director, genre, release_year, rating) VALUES (?, ?, ?, ?, ?)',
            [title, director, genre, release_year, rating]
        );
        res.status(201).json({ id: result.insertId, title, director, genre, release_year, rating });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an existing movie
app.put('/movies/:id', async (req, res) => {
    const { title, director, genre, release_year, rating } = req.body;
    try {
        await db.query(
            'UPDATE movies SET title=?, director=?, genre=?, release_year=?, rating=? WHERE id=?',
            [title, director, genre, release_year, rating, req.params.id]
        );
        res.json({ id: req.params.id, title, director, genre, release_year, rating });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a movie
app.delete('/movies/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM movies WHERE id=?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
