import { HttpService, Injectable } from '@nestjs/common';
import { ReducedIssue, Youtrack } from 'youtrack-rest-client';

@Injectable()
export class YoutrackService {
  constructor(
    private readonly youtrackClient: Youtrack,
  ) {
  }

  async getListIssue(query?:string): Promise<ReducedIssue[]> {
    if (query){
      return this.youtrackClient.issues.search(query)
    }
   return this.youtrackClient.issues.search("project: TR and updated: Today")
  }

}