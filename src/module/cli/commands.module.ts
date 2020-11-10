import { CommandModule } from 'nestjs-command';
import { YoutrackModule } from '../youtrack/youtrack.module';
import { HubModule } from '../hub/hub.module';
import { Module } from '@nestjs/common';
import { GetDataCommands } from './get-data.command';
import { ConfigModule } from '../config/config.module';
import { SpreadSheetModule } from '../spread-sheet/spread-sheet.module';

@Module({
  imports: [
    SpreadSheetModule,
    ConfigModule,
    YoutrackModule,
    CommandModule,
    HubModule,
  ],
  providers: [GetDataCommands],
})
export class CommandsModule {}
