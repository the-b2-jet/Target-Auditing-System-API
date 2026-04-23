const http = require('http');
const targets = require('./data/targets.json');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if(req.url == '/api/targets' && req.method == 'GET') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(targets));
    }else if(req.url.startsWith('/api/targets/' && req.method == 'GET')){
        const targetID = req.url.split('/')[3];
        const target = targets.find(t => t.id == parseInt(targetID));

        if(target){
            res.writeHead(200, {'Content-Type':'application/json'});
            res.end(JSON.stringify(target));
        }else{
            res.writeHead(404, {'Content-Type':'text/plain'});
            res.end('No such target');
        }
    }else{
        res.writeHead(404, {'Content-Type' : 'text/plain'});
        res.end('Not Found');
    }
})

const PORT = 1337;
server.listen(PORT, () => {
    console.log(`[*] Server running on http://127.0.0.1:${PORT}/api/targets`);
})