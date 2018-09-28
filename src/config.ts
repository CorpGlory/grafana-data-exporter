import * as path from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';

const DEFAULT_CONFIG = {
  'apiKeys': {
    'http://localhost:3000': ''
  },
  'port': '8000'
};

export const EXPORTED_PATH = path.join(__dirname, '../exported');
if(!fs.existsSync(EXPORTED_PATH)) {
  console.log(`${EXPORTED_PATH} doesn't exist, creating`);
  fs.mkdirSync(EXPORTED_PATH);
}

function getConfigField(field: string, defaultVal?: any) {
  let val = defaultVal;
  let configFile = path.join(__dirname, '../config.json');

  if(!fs.existsSync(configFile)) {
    console.log(`${configFile} doesn't exist, creating`);
    fs.writeFileSync(configFile, JSON.stringify(DEFAULT_CONFIG), 'utf8');
  }

  let data = fs.readFileSync(configFile, 'utf8');
  let configField = JSON.parse(data)[field];
  if(configField !== undefined) {
    val = configField;
  }

  if(val === undefined || val == '' || _.isEmpty(val)) {
    throw new Error(`Please configure ${field} in ${configFile}`);
  }

  return val;
}

export const port = getConfigField('port', '8000');
export const apiKeys = getConfigField('apiKeys');
