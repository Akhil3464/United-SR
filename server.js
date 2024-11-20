// Load express module
const express = require('express');
const path = require('path');

// Create an express application
const app = express();

// Define the port number
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the "css", "js", "images", and "font" directories
app.use('/scss', express.static(path.join(__dirname, 'scss')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));

// Define routes for your site
// Dynamic routing for all HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});
app.get('/:page', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, 'public', 'pages', `${page}.html`), (err) => {
        if (err) {
            res.status(404).sendFile(path.join(__dirname, 'public', 'pages', '404.html'));
        }
    });
});

// Handle 404 error for undefined routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'pages', '404.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
