import { Exporter } from './exporter';

class ExporterFactory {
  getExporter() {
    return new Exporter();
  }
}

export const exporterFactory = new ExporterFactory();
