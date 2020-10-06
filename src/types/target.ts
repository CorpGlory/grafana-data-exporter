import { Datasource } from '@corpglory/tsdb-kit';

export class Target {
    constructor(
      public panelUrl: string,
      public panelTitle: string,
      public panelId: number,
      public datasource: Datasource,
      public targets: Array<object>,
      public datasourceName: string,
    ) {}
}
