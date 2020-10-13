import { HttpService, Injectable } from '@nestjs/common';
import { ReducedIssue, Youtrack } from 'youtrack-rest-client';

@Injectable()
export class YoutrackService {
  constructor(
    private readonly youtrackClient: Youtrack,
  ) {
  }

  private top = 100;

  async addNewUsers(page = 1): Promise<ReducedIssue[]> {
    let users = await this.youtrackClient.users.all({
      $top: this.top * (page - 1),
      $skip: this.top,
    });
    if (users.length === this.top) {
      await this.addNewUsers(page++);
    }
    return this.youtrackClient.issues.search('project: TR and updated: Today');
  }

  async getListIssue(query?: string): Promise<ReducedIssue[]> {
    if (query) {
      return this.youtrackClient.issues.search(query);
    }
    return this.youtrackClient.issues.search('project: TR and updated: Today');
  }

}