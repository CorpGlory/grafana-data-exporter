import { EXPORTED_PATH } from './config';
import { router as tasksRouter } from './routes/tasks';
import { router as datasourceRouter } from './routes/datasource';
import { router as deleteRouter } from './routes/delete';

import * as express from 'express';
import * as bodyParser from 'body-parser';

const app = express();
const PORT = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
})

app.use('/tasks', tasksRouter);
app.use('/datasource', datasourceRouter);
app.use('/delete', deleteRouter);

app.use('/static', express.static(EXPORTED_PATH));
app.use('/', (req, res) => { res.send('Export-manager backend server works') });

app.listen(PORT, () => {
  console.log(`Server is running on :${PORT}`);
})
