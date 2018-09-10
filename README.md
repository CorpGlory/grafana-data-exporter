# Export-manager backend

Server for fetching data from Grafana datasources

Running on 80 port in Docker container.

Dockerfile has 2 volumes:

- `/var/www/api-keys.json` (required, contains API keys for your Grafana hosts, see [example](api-keys-example.json))
- `/var/www/exported` (optional, directory which contains exported csv files and info about them)

## Build

```
npm install
npm run build
```

## Run

```
npm start
```

## Development

You should have `nodemon` module installed to run development server.

```
npm i -g nodemon
npm run dev
```

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
