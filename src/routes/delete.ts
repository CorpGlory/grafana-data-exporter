import { EXPORTED_PATH } from '../config'

import * as express from 'express'
import * as fs from 'fs'
import * as path from 'path'


async function deleteTask(req, res) {
  let filename = req.query.filename;
  let csvFilePath = path.join(EXPORTED_PATH, `${filename}.csv`);
  let jsonFilePath = path.join(EXPORTED_PATH, `${filename}.json`);
  
  if(fs.existsSync(csvFilePath)) {
    fs.unlink(csvFilePath, err => console.error(err));
  }
  if(fs.existsSync(jsonFilePath)) {
    fs.unlink(jsonFilePath, err => console.error(err));
  }

  res.status(200).send({ status: 'OK' });
}

export const router = express.Router();

router.get('/', deleteTask);
