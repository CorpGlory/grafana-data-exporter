import { GrafanaAPI } from './grafana_api';

import * as csv from 'fast-csv';
import * as path from 'path';
import * as fs from 'fs';
import * as moment from 'moment';


const MS_IN_DAY = 24 * 60 * 60 * 1000;

export class Target {
  private exportedRows: number;
  private days: number;
  private day: number;
  private csvStream: any;
  private grafana: GrafanaAPI;

  constructor(
    private grafanaUrl: string,
    private user: string,
    private datasource: string,
    private measurement: string,
    private query: string,
    private from: number,
    private to: number
  ) {
    this.grafana = new GrafanaAPI(this.grafanaUrl);
  }

  public updateStatus(status) {
    let time = moment().valueOf();
    let data = {
      time,
      user: this.user,
      datasource: this.datasource,
      measurement: this.measurement,
      exportedRows: this.exportedRows,
      progress: (this.day / this.days).toLocaleString('en', { style: 'percent' }),
      status
    };
    return new Promise((resolve, reject) => {
      fs.writeFile(this.getFilePath('json'), JSON.stringify(data), 'utf8', err => {
        if(err) {
          console.error(err);
          reject('Can`t write file');
        } else {
          resolve();
        }
      });
    });
  }

  public async export() {
    this.exportedRows = 0;
    this.days = (this.to - this.from) / MS_IN_DAY;
    this.day = 0;
    this.initCsvStream();

    let to = this.to;
    let from = this.from;

    console.log(`Total days: ${this.days}`);
    while(this.day < this.days) {
      this.day++;
      to = from + MS_IN_DAY;

      console.log(`${this.day} day: ${from}ms -> ${to}ms`);

      let currentQuery = this.query.replace('$timeFilter', `time >= ${from}ms AND time <= ${to}ms`).replace('$__interval', '1s');
      let metrics = await this.grafana.queryDatasource(this.datasource, this.measurement, currentQuery);

      console.log(metrics);
      if(metrics.length > 0) {
        if(metrics !== undefined) {
          this.writeCsv(metrics);
        }
      }
      await this.updateStatus('exporting');

      from += MS_IN_DAY;
    }
    this.csvStream.end();
  }

  private initCsvStream() {
    this.csvStream = csv.createWriteStream({ headers: true });
    let writableStream = fs.createWriteStream(this.getFilePath('csv'));

    this.csvStream.pipe(writableStream);
    writableStream.on('finish', async () => {
      console.log('Everything is written');
      await this.updateStatus('finished');
    })
  }

  private writeCsv(series) {
    for(let serie of series) {
      for(let val of serie.values) {
        if(val[1] !== null) {
          let row = {};
          for(let col in serie.columns) {
            row[serie.columns[col]] = val[col];
          }
          this.csvStream.write(row);
          this.exportedRows++;
        }
      }
    }
  }

  private getFilename(extension) {
    return `${this.datasource}.${this.measurement}.${this.from}-${this.to}.${extension}`;
  }

  private getFilePath(extension) {
    let filename = this.getFilename(extension);
    return path.join(__dirname, `../exported/${filename}`);
  }

}
