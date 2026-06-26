import fs from 'fs';
import fetch from 'node-fetch';

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const uri = "http://192.168.1.6:32400"; // Assuming local plex is running here

async function run() {
    try {
        const res = await fetch(`${uri}/status/sessions/history/all?limit=5&X-Plex-Token=${config.plexToken}`, {headers: {'Accept':'application/json'}});
        const data = await res.json();
        console.log("Response for /history/all: ", JSON.stringify(data.MediaContainer.Metadata, null, 2));
    } catch (e) {
        console.error(e);
    }
}
run();
