// Create web server
// Start server: node comments.js

const http = require('http');
const url = require('url');
const fs = require('fs');

const server = http.createServer(function (req, res) {
    // Get data from url
    const parsedUrl = url.parse(req.url, true);
    // Get path
    const path = parsedUrl.pathname;
    // Get query
    const query = parsedUrl.query;
    // Get method
    const method = req.method;

    // Send response
    if (path === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Comments</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="comment"><button type="submit">Submit</button></form></body>');
        res.write('</html>');
        return res.end();
    }

    if (path === '/message' && method === 'POST') {
        const body = [];
        // Get data from request
        req.on('data', function (chunk) {
            console.log(chunk);
            body.push(chunk);
        });
        // Parse data from request
        return req.on('end', function () {
            const parsedBody = Buffer.concat(body).toString();
            // Get comment
            const comment = parsedBody.split('=')[1];
            // Write comment to file
            fs.writeFile('comments.txt', comment, function (err) {
                // Redirect to main page
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        });
    }

    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>Comments</title></head>');
    res.write('<body><h1>Comments</h1></body>');
    res.write('</html>');
    res.end();
});

server.listen(3000, function () {
    console.log('Server is running on port 3000');
});