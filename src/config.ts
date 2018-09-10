import * as path from 'path';
import * as fs from 'fs';

export const EXPORTED_PATH = path.join(__dirname, '../exported');


export function getApiKey(host) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, '../api-keys.json'), 'utf8', (err, data) => {
      if(err) {
        reject(err);
      }
      resolve(JSON.parse(data)[host]);
    });
  });
}
