const http = require('http');

const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Carol' },
];

const server = http.createServer((req, res) => {
    const { method, url } = req;

    const sendJson = (status, data) => {
        res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(data));
    }

    if (method === 'GET' && url === '/') { sendJson(200, { message: 'Hello Backend!'}); }
    else if (method === 'GET' && url === '/users') {
        sendJson(200, users);
    }
    else if (method === 'GET' && url.startsWith('/users/')) {
        const id = parseInt(url.split('/')[2]);
        const user = users.find(u => u.id === id);
        if (!user) {
            sendJson(404, { error: 'Not found'});
        }
        else { sendJson(200, user); }
    
    }
    else if (method === 'POST' && url === '/users') {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => {
            const body = Buffer.concat(chunks).toString();

            let data;
            try {
                data = JSON.parse(body);
            } catch (err) {
                return sendJson(400, { error: 'Invalid JSON' });
            }

            if (!data.name || typeof data.name !== 'string') {
                return sendJson(400, { error: 'Name required' });
            }

            const newUser = {
                id: users.length + 1, 
                name: data.name,
            };

            users.push(newUser);
            sendJson(201, newUser);
            
        });
    }
    else { sendJson(404, { error: 'Not found'}) }
});

server.listen(3000, () => console.log('Server  on http://localhost:3000'));
