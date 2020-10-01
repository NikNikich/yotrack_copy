import { Injectable } from '@nestjs/common';
import { Youtrack } from 'youtrack-rest-client';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ObserverService {
  constructor(
    private readonly youtrackClient: Youtrack
  ) {
  }

  @Cron('* * * * *')
  private fetchDataFromYoutrack() {
    // TODO: добавить получение данных
  }
}