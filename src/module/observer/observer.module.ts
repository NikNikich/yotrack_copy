import { Module } from '@nestjs/common';
import { YoutrackModule } from '../youtrack/youtrack.module';
import { ObserverService } from './observer-service';

@Module({
  imports: [
    YoutrackModule.forRootAsync({
      useFactory: () => ({
        token: 'perm:',
        baseUrl: 'https://ytr.omega-r.club',
      }),
    })
  ],
  providers: [ObserverService]
})
export class ObserverModule {
}