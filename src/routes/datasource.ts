import { EXPORTED_PATH } from '../config';

import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';


function sendOk(req, res) {
  res.status(200).send('Datasource works');
}

function search(req, res) {
  fs.readdir(EXPORTED_PATH, err => {
    if(err) {
      console.error(err);
      res.status(500).send('Something went wrong');
    } else {
      res.status(200).send(['All tasks']);
    }
  })
}

function query(req, res) {
  let body = req.body;
  let targets = body.targets;

  let resp = {
    target: targets[0].target,
    type: 'table',
    columns: [
      {
        text: 'Time',
        type: 'time'
      },
      {
        text: 'User',
        type: 'string'
      },
      {
        text: 'Datasource',
        type: 'string'
      },
      {
        text: 'Exported Rows',
        type: 'number'
      },
      {
        text: 'Progress',
        type: 'string'
      },
      {
        text: 'Download CSV',
        type: 'string'
      },
      {
        text: 'Status',
        type: 'string'
      },
      {
        text: 'Delete task',
        type: 'string'
      }
    ],
    rows: []
  };

  for(let target of targets) {
    fs.readdir(EXPORTED_PATH, (err, items) => {
      if(err) {
        console.error(err);
        res.status(500).send('Something went wrong');
      } else {
        for(let item of items) {
          let file = path.parse(item);
          if(file.ext !== '.json') {
            continue;
          }
          // TODO: read async
          let data = fs.readFileSync(path.join(EXPORTED_PATH, item), 'utf8')
          let status = JSON.parse(data)

          let requestedUrl = `http://${req.headers.host}`;
          let downloadLink = '';
          let deleteLink = '';
          if(status.status === 'finished') {
            downloadLink = `<a class="download-csv" href="${requestedUrl}/static/${file.name}.csv" target="_blank"><i class="fa fa-download"></i></a>`;
            deleteLink = `<a class="delete-task" href="${requestedUrl}/delete?filename=${file.name}"><i class="fa fa-times"></i></a>`;
          }
          resp.rows.push([
            status.time,
            status.user,
            status.datasourceName,
            status.exportedRows,
            status.progress,
            downloadLink,
            status.status,
            deleteLink
          ]);
        }

        res.status(200).send([resp]);
      }
    })
  }

}

function sendAnnotations(req, res) {
  res.status(200).send([]);
}

export const router = express.Router();

router.get('/', sendOk);
router.post('/search', search);
router.post('/query', query);
router.post('/annotations', sendAnnotations);

