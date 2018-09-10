import { getApiKey } from './config';

import axios from 'axios';


export class GrafanaAPI {
  private apiKey;
  constructor(private grafanaUrl) {
    getApiKey(grafanaUrl)
      .then(key => {
        this.apiKey = key;
        console.log(this.apiKey);
      });
  }

  private get _headers() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  }

  private async _getDatasourceByName(name) {
    return fetch(`${this.grafanaUrl}/api/datasources/name/${name}`, {
      method: 'GET',
      headers: this._headers
    })
      .then(data => data.json());
  }

  public async queryDatasource(datasourceName, measurement, query) {
    let datasource = await this._getDatasourceByName(datasourceName);

    return this._queryGrafana(`${this.grafanaUrl}/api/datasources/proxy/${datasource.id}/query`, {
      q: encodeURIComponent(query),
      db: datasource.database,
      epoch: 'ms'
    });
  }

  private async _queryGrafana(url: string, params: any) {
    try {
      var res = await axios.get(url, { params, headers: this._headers });
    } catch (e) {
      if(e.response.status === 401) {
        throw new Error('Unauthorized. Check the $HASTIC_API_KEY.');
      }
      throw new Error(e.message);
    }

    if (res.data.results === undefined) {
      throw new Error('results field is undefined in response.');
    }

    // TODO: support more than 1 metric (each res.data.results item is a metric)
    let results = res.data.results[0];
    if (results.series === undefined) {
      return [];
    }

    return results.series[0].values as [number, number][];
  }

}

