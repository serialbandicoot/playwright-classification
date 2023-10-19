const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        // Serve the HTML page
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (req.url === '/image/five.jpg' || req.url === '/image/nofive.jpg' || req.url === '/image/four.jpg' || req.url === '/image/nine.jpg' || req.url === '/image/two.jpg') {
        const imageName = req.url.substring(7); // Get the image filename from the URL
        // Serve the image
        fs.readFile(path.join(__dirname, 'images', imageName), (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Image not found');
            } else {
                res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                res.end(data);
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
