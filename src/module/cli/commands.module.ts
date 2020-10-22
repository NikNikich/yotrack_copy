import { CommandModule, CommandService } from 'nestjs-command';
import { YoutrackModule } from '../youtrack/youtrack.module';
import { HubModule } from '../hub-youtrack/hub.module';
import { Module } from '@nestjs/common';
import { GetDataCommands } from './get-data.command';
import { ObserverModule } from '../observer/observer.module';

@Module({
  imports: [
    YoutrackModule,
    CommandModule,
    HubModule,
    ObserverModule,

  ],
  providers: [GetDataCommands],
})
export class CommandsModule {
}
