import { Test } from '@nestjs/testing';

import { ConfigModule } from '../../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '../../config/config.service';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import {
  IssuesFake,
  IssuesTrackFake,
  ProjectFake,
  UserFake,
} from './test.constant';
import { YoutrackServiceDS } from '../youtrack-ds.service';
import { YoutrackModuleDS } from '../youtrack-ds.module';
import { YOUTRACK_DS_KEY } from '../youtrack-ds.const';
import {
  IIssue,
  IProject,
  ITimeTracking,
  IUser,
} from '../../youtrack/youtrack.interface';

describe('HttpYoutrackService', () => {
  let youtrackServiceDS: YoutrackServiceDS;
  const youtrackServiceDSMock = {
    getListUserDS: async (skip?: number, top?: number): Promise<IUser[]> => {
      return [
        {
          id: UserFake.ID,
          fullName: UserFake.FULL_NAME,
          ringId: UserFake.RING_ID,
        } as IUser,
      ];
    },
    getListProjectDS: async (
      skip?: number,
      top?: number,
    ): Promise<IProject[]> => {
      return [
        {
          id: ProjectFake.ID,
          name: ProjectFake.NAME,
          hubResourceId: ProjectFake.HUB_RESOURCE_ID,
        } as IProject,
      ];
    },
    getListIssueDS: async (
      skip?: number,
      top?: number,
      query?: string,
    ): Promise<IIssue[]> => {
      return [
        {
          id: IssuesFake.ID,
          summary: IssuesFake.SUMMARY,
          project: IssuesFake.PROJECT,
          parent: IssuesFake.PARENT,
          updater: IssuesFake.UPDATER,
          customFields: [IssuesFake.CUSTOM_FIELDS],
        } as IIssue,
      ];
    },
    getListIssueTrackDS: async (
      issueId: string,
      skip?: number,
      top?: number,
    ): Promise<ITimeTracking[]> => {
      return [
        {
          id: IssuesTrackFake.ID,
          text: IssuesTrackFake.TEXT,
          duration: IssuesTrackFake.DURATION,
          created: IssuesTrackFake.CREATED,
          author: IssuesTrackFake.AUTHOR,
          date: IssuesTrackFake.DATE,
        } as ITimeTracking,
      ];
    },
    getIssueDS: async (issueId: string, query?: string): Promise<IIssue> => {
      return {
        id: IssuesFake.ID,
        summary: IssuesFake.SUMMARY,
        project: IssuesFake.PROJECT,
        parent: IssuesFake.PARENT,
        updater: IssuesFake.UPDATER,
        customFields: [IssuesFake.CUSTOM_FIELDS],
      } as IIssue;
    },
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        YoutrackModuleDS.forRootAsync({
          useFactory: async (configService: ConfigService) => ({
            baseURL: configService.config.YOUTRACK_BASE_URL + '/api',
          }),
          inject: [ConfigService],
        }),
        TypeOrmModule.forRootAsync({
          useFactory: async (
            configService: ConfigService,
          ): Promise<TypeOrmModuleOptions> => ({
            keepConnectionAlive: true,
            type: configService.config.TYPEORM_CONNECTION,
            host: configService.config.TYPEORM_HOST,
            port: configService.config.TYPEORM_PORT,
            username: configService.config.TYPEORM_USERNAME,
            password: configService.config.TYPEORM_PASSWORD,
            database: configService.config.TYPEORM_DATABASE,
            logging: configService.config.TYPEORM_LOGGING,
            synchronize: configService.config.TYPEORM_SYNCHRONIZE,
            entities: ['src/**/*.entity.ts'],
          }),
          inject: [ConfigService],
        }),
        ConfigModule.register(process.cwd() + '/.env'),
      ],
    })
      .overrideProvider(YOUTRACK_DS_KEY)
      .useValue(youtrackServiceDSMock)
      .compile();

    youtrackServiceDS = moduleRef.get<YoutrackServiceDS>(YOUTRACK_DS_KEY);
  });

  it('get a list of users http', async () => {
    const actualResult = await youtrackServiceDS.getListUserDS();
    const sortedActualResult = actualResult.sort();
    const iUser: IUser = {
      id: UserFake.ID,
      fullName: UserFake.FULL_NAME,
      ringId: UserFake.RING_ID,
    };
    const expectResult: IUser[] = [iUser];
    const sortedExpectResult = expectResult.sort();
    expect(sortedActualResult).toEqual(sortedExpectResult);
  });

  it('get a list of project http', async () => {
    const actualResult = await youtrackServiceDS.getListProjectDS();
    const sortedActualResult = actualResult.sort();
    const iProject: IProject = {
      id: ProjectFake.ID,
      name: ProjectFake.NAME,
      hubResourceId: ProjectFake.HUB_RESOURCE_ID,
    };
    const expectResult: IProject[] = [iProject];
    const sortedExpectResult = expectResult.sort();
    expect(sortedActualResult).toEqual(sortedExpectResult);
  });

  it('get a list issues http', async () => {
    const actualResult = await youtrackServiceDS.getListIssueDS();
    const sortedActualResult = actualResult.sort();
    const iIssue: IIssue = {
      id: IssuesFake.ID,
      summary: IssuesFake.SUMMARY,
      project: IssuesFake.PROJECT,
      parent: IssuesFake.PARENT,
      updater: IssuesFake.UPDATER,
      customFields: [IssuesFake.CUSTOM_FIELDS],
    };
    const expectResult: IIssue[] = [iIssue];
    const sortedExpectResult = expectResult.sort();
    expect(sortedActualResult).toEqual(sortedExpectResult);
  });

  it('get a list issues track http', async () => {
    const ISSUE_ID = '1';
    const actualResult = await youtrackServiceDS.getListIssueTrackDS(ISSUE_ID);
    const sortedActualResult = actualResult.sort();
    const iTimeTracking: ITimeTracking = {
      id: IssuesTrackFake.ID,
      text: IssuesTrackFake.TEXT,
      duration: IssuesTrackFake.DURATION,
      created: IssuesTrackFake.CREATED,
      author: IssuesTrackFake.AUTHOR,
      date: IssuesTrackFake.DATE,
    };
    const expectResult: ITimeTracking[] = [iTimeTracking];
    const sortedExpectResult = expectResult.sort();
    expect(sortedActualResult).toEqual(sortedExpectResult);
  });

  it('get issues http', async () => {
    const ISSUE_ID = '1';
    const actualResult = await youtrackServiceDS.getIssueDS(ISSUE_ID);
    const expectResult: IIssue = {
      id: IssuesFake.ID,
      summary: IssuesFake.SUMMARY,
      project: IssuesFake.PROJECT,
      parent: IssuesFake.PARENT,
      updater: IssuesFake.UPDATER,
      customFields: [IssuesFake.CUSTOM_FIELDS],
    };
    expect(actualResult).toEqual(expectResult);
  });
});
