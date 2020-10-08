import { HttpService, Injectable } from '@nestjs/common';
import { ReducedIssue, Youtrack } from 'youtrack-rest-client';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

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