const http = require('http');
const fs = require('fs');
const path = require('path');
const targets_path = path.join(__dirname, 'data', 'targets.json');

const sendResponse = (res, statusCode, data, contentType = 'application/json') => {
    res.writeHead(statusCode, { 'Content-Type': contentType });
    res.end(typeof data == 'string' ? data : JSON.stringify(data));
};

const addTarget = async (target) => {
    const data = await fs.promises.readFile(targets_path, 'utf-8');
    const targets = JSON.parse(data);
    
    const newId = targets.length > 0 ? targets[targets.length - 1].id + 1 : 1;
    target.id = newId;
    target.logged_at = new Date().toISOString();
    
    targets.push(target);
    await fs.promises.writeFile(targets_path, JSON.stringify(targets, null, 2));
    return target;
};

const server = http.createServer(async (req, res) => {

    if(req.url == '/api/targets' && req.method == 'GET') {
        const data = await fs.promises.readFile(targets_path, 'utf-8');
        const targets = JSON.parse(data);

        sendResponse(res, 200, targets);
    }else if(req.url.startsWith('/api/targets/') && req.method == 'GET'){
        const targetID = req.url.split('/')[3];
        const data = await fs.promises.readFile(targets_path, 'utf-8');
        const targets = JSON.parse(data);
        const target = targets.find(t => t.id == parseInt(targetID));

        if(target){
            sendResponse(res, 200, target);
        }else{
            sendResponse(res, 404, 'Target Not Found', 'text/plain');
        }
    }else if(req.url == '/api/add-target' && req.method == 'POST'){
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try{
                const newTarget = JSON.parse(body);
                const addedTarget = await addTarget(newTarget);
                sendResponse(res, 201, addedTarget);
            }catch(error){
                sendResponse(res, 400, 'Invalid JSON', 'text/plain');
            }
        });
    }else {
        sendResponse(res, 404, 'Not Found', 'text/plain');
    }
});

const PORT = 1337;
server.listen(PORT, () => {
    console.log(`[*] Target Manager live on http://127.0.0.1:${PORT}`);
});