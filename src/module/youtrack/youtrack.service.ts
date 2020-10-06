import { Injectable } from '@nestjs/common';
import { YoutrackSdkModule } from '../youtrack_sdk/youtrack_sdk.module';
import { ReducedUser, User, Youtrack } from 'youtrack-rest-client';

@Injectable()
export class YoutrackService {
  constructor(
    private readonly youtrackSdk: Youtrack,
  ) {
  }

  async getListUsers(): Promise<ReducedUser[]> {
   return this.youtrackSdk.users.all();
  }
}