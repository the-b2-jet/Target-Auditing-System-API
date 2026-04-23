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

const updateTarget = async (target) => {
    const data = await fs.promises.readFile(targets_path, 'utf-8');
    const targets = JSON.parse(data);
    const index = targets.findIndex(t => t.id == target.id);
    
    if (index !== -1) {
        targets[index] = { ...targets[index], ...target, updated_at: new Date().toISOString() };
        await fs.promises.writeFile(targets_path, JSON.stringify(targets, null, 2));
    }
    return target;
};

const deleteTarget = async (id) => {
    const data = await fs.promises.readFile(targets_path, 'utf-8');
    const targets = JSON.parse(data || '[]');
    const index = targets.findIndex(t => t.id == id);
    
    if (index !== -1) {
        const deletedTarget = targets.splice(index, 1)[0];
        await fs.promises.writeFile(targets_path, JSON.stringify(targets, null, 2));
        return deletedTarget;
    }
    return null;
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
    }else if(req.url == '/api/targets' && req.method == 'POST'){
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try{
                const newTarget = JSON.parse(body);
                
                newTarget.target_ip = newTarget.target_ip || "";
                newTarget.hostname = newTarget.hostname || "";
                newTarget.vulnerability_type = newTarget.vulnerability_type || "";
                newTarget.vulnerability_severity = newTarget.vulnerability_severity || "";
                newTarget.status = newTarget.status || "";
                newTarget.access_level = newTarget.access_level || "";
                newTarget.os_info = newTarget.os_info || "";
                newTarget.open_ports = newTarget.open_ports || [];
                newTarget.notes = newTarget.notes || "";
                
                const addedTarget = await addTarget(newTarget);
                sendResponse(res, 201, addedTarget);
            }catch(error){
                sendResponse(res, 400, 'Invalid JSON', 'text/plain');
            }
        });
    }else if(req.url.startsWith('/api/targets/') && req.method == 'PUT') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const targetID = req.url.split('/')[3];
                const updatedData = JSON.parse(body);
                updatedData.id = parseInt(targetID);
                const result = await updateTarget(updatedData);
                sendResponse(res, 200, result);
            } catch (error) {
                sendResponse(res, 400, 'Invalid JSON', 'text/plain');
            }
        });
    }
    else if(req.url.startsWith('/api/targets/') && req.method == 'DELETE') {
        (async () => {
            const targetID = req.url.split('/')[3];
            const result = await deleteTarget(parseInt(targetID));
            if (result) {
                sendResponse(res, 200, result);
            } else {
                sendResponse(res, 404, 'Target Not Found', 'text/plain');
            }
        })();
    }else {
        sendResponse(res, 404, 'Not Found', 'text/plain');
    }
});

const PORT = 1337;
server.listen(PORT, () => {
    console.log(`[*] Target Manager live on http://127.0.0.1:${PORT}`);
});