import { ModuleMetadata, Type } from '@nestjs/common';
import {
  IGoogleExcelOptions,
  IGoogleExcelOptionsFactory,
} from './google-excel-options-factory';

export interface IGoogleExcelAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<IGoogleExcelOptionsFactory>;
  useClass?: Type<IGoogleExcelOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<IGoogleExcelOptions> | IGoogleExcelOptions;
  inject?: any[];
}
