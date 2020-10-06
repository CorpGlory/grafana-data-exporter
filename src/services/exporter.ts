import { Target } from '../types/target';
import { URL } from 'url';
import { apiKeys } from '../config';
import { promisify } from '../utils';
import { ExportStatus } from '../types/export-status';

import { Metric, queryByMetric } from '@corpglory/tsdb-kit';

import * as moment from 'moment';
import * as csv from 'fast-csv';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

const MS_IN_DAY = 24 * 60 * 60 * 1000;
const TIMESTAMP_COLUMN = 'timestamp';

export class Exporter {
  private exportedRows = 0;
  private createdTimestamp: number;
  private user: string;
  private datasource: string;

  private initCsvStream() {
    const csvStream = csv.createWriteStream({ headers: true });
    const writableStream = fs.createWriteStream(this.getFilePath('csv'));

    csvStream.pipe(writableStream);
    writableStream.on('finish', async () => {
      console.log(`Everything is written to ${this.getFilename('csv')}`);
      await this.updateStatus(ExportStatus.FINISHED, 1);
    })

    return csvStream;
  }

  public async updateStatus(status: string, progress: number) {
    try {
      let time = moment().valueOf();
      let data = {
        time,
        user: this.user,
        exportedRows: this.exportedRows,
        progress: progress.toLocaleString('en', { style: 'percent' }),
        status,
        datasourceName: this.datasource,
      };

      await promisify(fs.writeFile, this.getFilePath('json'), JSON.stringify(data), 'utf8')
    } catch(err) {
      console.error(err);
      throw new Error('Can`t write file');
    }
  }

  public async export(data: Target[], user: string, from: number, to: number) {
    this.user = user;

    this.validateTargets(data);
    const targets = data.map(target => ({
      ...target,
      metric: new Metric(target.datasource, target.targets)
    }));

    this.datasource = data.length === 1 ? data[0].datasourceName : 'all';

    const stream = this.initCsvStream();
    const days = Math.ceil((to - from) / MS_IN_DAY);

    console.log(`Total days: ${days}`);

    for(let day = 0; day < days; day++) {
      to = from + MS_IN_DAY;

      console.log(`${day} day: ${from}ms -> ${to}ms`);

      const columns = [TIMESTAMP_COLUMN];
      const values = {};

      for(const [index, target] of targets.entries()) {
        const host = new URL(target.panelUrl).origin;
        const apiKey = apiKeys[host];

        const datasourceMetrics = await queryByMetric(target.metric, target.panelUrl, from, to, apiKey);

        const column = `${target.panelId}` +
          `-${target.panelTitle.replace(' ', '-')}-${datasourceMetrics.columns[1]}`;

        columns.push(column);

        for(const row of datasourceMetrics.values) {
          const [timestamp, value] = row;

          if(values[timestamp] === undefined) {
            values[timestamp] = new Array(targets.length);
          }
          values[timestamp][index] = value;
        }
      }

      const metricsValues = [];

      Object.keys(values).forEach(timestamp => {
        metricsValues.push([timestamp, ...values[timestamp]]);
      });

      if(metricsValues.length > 0) {
        this.writeCsv(stream, {
          columns,
          values: metricsValues,
        });
      }
      await this.updateStatus(ExportStatus.EXPORTING, (day + 1) / days);

      from += MS_IN_DAY;
    }
    stream.end();
  }

  private validateTargets(targets: Target[]) {
    if(!targets || !Array.isArray(targets)) {
      throw new Error('Incorrect targets format');
    }

    for(const target of targets) {
      const host = new URL(target.panelUrl).origin;
      const apiKey = apiKeys[host];

      if(apiKey === undefined || apiKey === '') {
        throw new Error(`Please configure API key for ${host}`);
      }
    }
  }

  private writeCsv(stream, series) {
    for(let row of series.values) {
      const isEmpty = _.every(
        _.slice(row, 1),
        val => val === null
      );
      if(!isEmpty) {
        let csvRow = {};
        for(let col in series.columns) {
          csvRow[series.columns[col]] = row[col];
        }
        stream.write(csvRow);
        this.exportedRows++;
      }
    }
  }

  private getFilename(extension) {
    if(this.createdTimestamp === undefined) {
      this.createdTimestamp = moment().valueOf();
    }
    return `${this.createdTimestamp}.${this.datasource}.${extension}`;
  }

  private getFilePath(extension) {
    let filename = this.getFilename(extension);
    return path.join(__dirname, `../exported/${filename}`);
  }
}
