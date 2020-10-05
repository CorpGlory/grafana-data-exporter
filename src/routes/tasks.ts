import { Target } from '../types/target'

import * as express from 'express'
import { Datasource } from '@corpglory/tsdb-kit';
import { exporterFactory } from '../services/exporter.factory';

type TRequest = {
  body: {
    from: string,
    to: string,
    data: Array<{
      panelUrl: string,
      panelTitle: string,
      panelId: number,
      datasourceRequest: Datasource,
      datasourceName: string,
      target: object,
    }>,
    user: string,
  }
};

async function addTask(req: TRequest, res) {
  const body = req.body;
  const from = parseInt(body.from);
  const to = parseInt(body.to);
  const data = body.data;
  const user = body.user;

  data.forEach(d => console.log(d));

  if(isNaN(from) || isNaN(to)) {
    res.status(400).send('Range error: please fill both "from" and "to" fields');
  } else if(from >= to) {
    res.status(400).send('Range error: "from" should be less than "to"');
  } else {
    const names = data.map(item => item.datasourceName).join(', ');
    res.status(200).send(`Exporting ${names} data from ${new Date(from).toLocaleString()} to ${new Date(to).toLocaleString()}`);

    const targets = data.map(item => new Target(
      item.panelUrl,
      item.panelTitle,
      item.panelId,
      item.datasourceRequest,
      [item.target],
      item.datasourceName,
    ));

    const exporter = exporterFactory.getExporter();
    exporter.export(targets, user, from, to);
  }
}

export const router = express.Router();

router.post('/', addTask);
