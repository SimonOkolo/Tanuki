import express from 'express';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const PORT = process.env.PORT || 4000;

const API_BASE_URL = 'http://localhost:3000/anime/gogoanime';

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from the 'public' and 'dist' directories
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

// Explicitly serve JavaScript files with the correct MIME type
app.get('*.js', (req, res, next) => {
    const filePath = path.join(__dirname, req.path);
    console.log(`Serving JavaScript file: ${filePath}`);
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(`Error serving JavaScript file: ${filePath}`, err);
            res.status(404).send('JavaScript file not found');
        }
    });
});

// Proxy API requests
app.use('/api', async (req, res) => {
    const url = `${API_BASE_URL}${req.url}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${url}: ${response.statusText}`);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Serve the index.html file for all other routes
app.get('*', (req, res) => {
    const filePath = path.join(__dirname, 'public', req.path);
    console.log(`Serving file: ${filePath}`);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(`Error serving file: ${filePath}`, err);
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});