import { YoutrackTokenOptions } from 'youtrack-rest-client/dist/options/youtrack_options';

export interface YoutrackOptionsFactory {
  createYoutrackOptions(): Promise<YoutrackTokenOptions> | YoutrackTokenOptions;
}
