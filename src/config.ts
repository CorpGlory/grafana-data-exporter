import * as path from 'path';
import * as fs from 'fs';

export const EXPORTED_PATH = path.join(__dirname, '../exported');
if(!fs.existsSync(EXPORTED_PATH)) {
  console.log(`${EXPORTED_PATH} don't exist, creating`);
  fs.mkdirSync(EXPORTED_PATH);
}

export function getApiKey(host) {
  let data = fs.readFileSync(path.join(__dirname, '../api-keys.json'), 'utf8');

  return JSON.parse(data)[host]
}
