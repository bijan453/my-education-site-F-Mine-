import fs from 'fs';
import { spawn } from 'child_process';
import path from 'path';
import readline from 'readline';

const CSV_PATH = process.argv[2] || 'lichess_db_puzzle.csv.zst';
const OUT_PATH = path.join(process.cwd(), 'puzzles.json');

// Parse a single CSV line (handles quoted fields)
function parseLine(line) {
  const out = [];
  let cur = '', q = false;
  for (const ch of line) {
    if (ch === '"') { q = !q; continue; }
    if (ch === ',' && !q) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  out.push(cur);
  return out;
}

async function main() {
  if (!fs.existsSync(CSV_PATH)) {
    console.log(`File ${CSV_PATH} not found. Use: node import-puzzles.js <path-to-csv.zst>`);
    console.log('Creating empty puzzles.json...');
    fs.writeFileSync(OUT_PATH, '');
    return;
  }

  const zstdPath = path.join(process.cwd(), 'zstd.exe');
  const isZst = CSV_PATH.endsWith('.zst');
  const input = isZst
    ? spawn(zstdPath, ['-d', '--stdout', CSV_PATH], { stdio: ['ignore', 'pipe', 'inherit'] }).stdout
    : fs.createReadStream(CSV_PATH, 'utf8');

  // Write output as NDJSON: one JSON object per line, no array wrapper
  const outStream = fs.createWriteStream(OUT_PATH, { flags: 'w' });

  const rl = readline.createInterface({ input, crlfDelay: Infinity });
  let header = true;
  let count = 0;

  for await (const line of rl) {
    if (header) { header = false; continue; }
    if (!line.trim()) continue;

      const cols = parseLine(line);
      if (cols.length >= 8 && cols[0] && cols[1]) {
        const obj = {
          id: cols[0],
          fen: cols[1],
          moves: cols[2],
          rating: parseInt(cols[3], 10) || 0,
          themes: cols[7] || '',
      };
      outStream.write(JSON.stringify(obj) + '\n');
      count++;
      if (count % 100000 === 0) process.stdout.write(`\rImported ${count.toLocaleString()} puzzles`);
    }
  }

  outStream.end();
  await new Promise(resolve => outStream.on('finish', resolve));

  process.stdout.write(`\nDone! ${count.toLocaleString()} puzzles saved to ${OUT_PATH}\n`);
}

main().catch(console.error);