# Grafana data exporter

Server for fetching data from Grafana datasources

## Why would you use it

* To export your metrics on a very big range for analysis
* To migrate from one datasource to another

## Quick start

Read [wiki page](https://github.com/CorpGlory/grafana-data-exporter/wiki/How-to-use) for quick start

## See also

[grafana-data-exporter-panel](https://github.com/CorpGlory/grafana-data-exporter-panel) - Grafana panel used for exporting data

## Changelog

### [0.3.1] - 2018-05-14
#### Added
- Show confirmation modal on task delete.

### [0.3.0] - 2018-05-10
#### Added
- Save user that initialized export.
- Support different grafana URLs.
- Delete tasks.

### [0.2.0] - 2018-05-09
#### Added
- Fetch data from Grafana API and save it to CSV.
- Endpoint for showing task status in Simple-JSON datasource format.
- CSV download URL on task finish.
