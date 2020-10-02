import { Target } from '../target'

import * as express from 'express'
import {Datasource} from "@corpglory/tsdb-kit";

type DatasourceData = {
  panelUrl: string,
  datasourceRequest: Datasource,
  datasourceName: string
};

async function addTask(req, res) {
  const body = req.body;
  const from = parseInt(body.from);
  const to = parseInt(body.to);
  const data: DatasourceData[] = body.data;
  const targets = [body.target];
  const user = body.user;

  if(isNaN(from) || isNaN(to)) {
    res.status(500).send('Range error: please fill both "from" and "to" fields');
  } else if(from >= to) {
    res.status(500).send('Range error: "from" should be less than "to"');
  } else {
    const names = data.map(item => item.datasourceName).join(', ');
    res.status(200).send('Exporting ' + names + ' data from ' + new Date(from).toLocaleString() + ' to ' + new Date(to).toLocaleString());

    data.forEach(request => {
      const target = new Target(request.panelUrl, user, request.datasourceRequest, targets, from, to, request.datasourceName);
      target.export();
    });
  }
}

export const router = express.Router();

router.post('/', addTask);
