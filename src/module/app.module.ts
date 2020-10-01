import { Module } from '@nestjs/common';
import { ObserverModule } from './observer/observer.module';

@Module({
  imports: [ObserverModule]
})
export class AppModule {
}
