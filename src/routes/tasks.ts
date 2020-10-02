import { Target } from '../target'

import * as express from 'express'
import { Datasource } from '@corpglory/tsdb-kit';

type TRequest = {
  body: {
    from: string,
    to: string,
    data: Array<{
      panelUrl: string,
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

  if(isNaN(from) || isNaN(to)) {
    res.status(400).send('Range error: please fill both "from" and "to" fields');
  } else if(from >= to) {
    res.status(400).send('Range error: "from" should be less than "to"');
  } else {
    const names = data.map(item => item.datasourceName).join(', ');
    res.status(200).send(`Exporting ${names} data from ${new Date(from).toLocaleString()} to ${new Date(to).toLocaleString()}`);

    data.forEach(request => {
      const target = new Target(request.panelUrl, user, request.datasourceRequest, [request.target], from, to, request.datasourceName);
      target.export();
    });
  }
}

export const router = express.Router();

router.post('/', addTask);
