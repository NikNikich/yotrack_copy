import { ModuleMetadata, Type } from '@nestjs/common';
import { YoutrackTokenOptions } from 'youtrack-rest-client/dist/options/youtrack_options';
import { YoutrackOptionsFactory } from './youtrack-options-factory';

export interface YoutrackModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<YoutrackOptionsFactory>;
  useClass?: Type<YoutrackOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<YoutrackTokenOptions> | YoutrackTokenOptions;
  inject?: any[];
}
