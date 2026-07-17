import fs from 'fs';
import readline from 'readline';

const RAILWAY_URL = process.argv[2] || 'https://my-education-site-f-mine-production.up.railway.app';
const PUZZLE_FILE = process.argv[3] || 'puzzles.json';
const BATCH = 5000;

if (!fs.existsSync(PUZZLE_FILE)) {
  console.log('No puzzles.json found');
  process.exit(1);
}

const size = fs.statSync(PUZZLE_FILE).size;
console.log(`Uploading from ${PUZZLE_FILE} (${(size / 1e6).toFixed(0)}MB) to ${RAILWAY_URL}`);
console.log('Do NOT close this window!\n');

const rl = readline.createInterface({ input: fs.createReadStream(PUZZLE_FILE, 'utf8'), crlfDelay: Infinity });
let batch = [], total = 0, errors = 0;

async function flush() {
  if (!batch.length) return;
  const b = batch;
  batch = [];
  for (let retries = 0; retries < 3; retries++) {
    try {
      const r = await fetch(RAILWAY_URL + '/api/puzzle/import-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ puzzles: b }),
      });
      const data = await r.json();
      total = data.total || total;
      process.stdout.write(`\r${total.toLocaleString()} puzzles on server...`);
      return;
    } catch (e) {
      errors++;
      if (retries < 2) await new Promise(r => setTimeout(r, 2000));
    }
  }
}

for await (const line of rl) {
  if (!line.trim()) continue;
  try {
    const p = JSON.parse(line);
    if (p.id && p.fen && p.moves) {
      batch.push({ id: p.id, fen: p.fen, moves: p.moves, rating: p.rating || 0, themes: p.themes || '' });
    }
  } catch {}
  if (batch.length >= BATCH) await flush();
}
await flush();
console.log(`\n\nDone! ${total.toLocaleString()} puzzles on server. (${errors} errors)`);
