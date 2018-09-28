import * as path from 'path';
import * as fs from 'fs';

export const EXPORTED_PATH = path.join(__dirname, '../exported');
if(!fs.existsSync(EXPORTED_PATH)) {
  console.log(`${EXPORTED_PATH} don't exist, creating`);
  fs.mkdirSync(EXPORTED_PATH);
}

function getConfigField(field: string, defaultVal?: any) {
  let data = fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8');
  let result = JSON.parse(data)[field];
  if(result !== undefined) {
    return result;
  } else {
    return defaultVal;
  }
}

export const port = getConfigField('port', '8000');
export const apiKeys = getConfigField('apiKeys');
