const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'config.json');

async function testHistory() {
    try {
        const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
        const uri = 'https://' + config.plexAddress; // Quick hack, but getPlexConnectionUri is complex. I'll just use fetch on the local IP if available.
        // Actually, config.plexAddress might not exist. Let's check config.json.
        console.log(config);
    } catch (e) {
        console.error(e);
    }
}
testHistory();
