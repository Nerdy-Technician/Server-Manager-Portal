const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'config.json');

async function testPlex() {
    try {
        const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
        const token = config.plexToken;
        console.log("Token length:", token.length);
        
        // Use an existing known fetch utility function equivalent
        // Actually I don't know the uri. Let's just read it from the config if possible.
        // I will just use the code from index.js getPlexConnectionUri.
    } catch (e) {
        console.error(e);
    }
}
testPlex();
