import { HttpYoutrackService } from '../http-youtrack.service';
import { Test } from '@nestjs/testing';
import { HttpYoutrackModule } from '../http-youtrack.module';
import {
  IIssue,
  IProject,
  ITimeTracking,
  IUser,
} from '../../youtrack/youtrack.interface';
import { ConfigModule } from '../../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '../../config/config.service';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import {
  ConfigFake,
  ISSUE_ID,
  IssuesFake,
  IssuesTrackFake,
  ProjectFake,
  UserFake,
} from './test.constant';

describe('HttpYoutrackService', () => {
  let httpYoutrackService: HttpYoutrackService;
  const httpYoutrackServiceMock = {
    getListUserHttp: async (skip?: number, top?: number): Promise<IUser[]> => {
      return [
        {
          id: UserFake.ID,
          fullName: UserFake.FULL_NAME,
          ringId: UserFake.RING_ID,
        } as IUser,
      ];
    },
    getListProjectHttp: async (
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
    getListIssueHttp: async (
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
    getListIssueTrackHttp: async (
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
    getIssueHttp: async (issueId: string, query?: string): Promise<IIssue> => {
      return {
        id: IssuesFake.ID,
        summary: IssuesFake.SUMMARY,
        project: IssuesFake.PROJECT,
        parent: IssuesFake.PARENT,
        updater: IssuesFake.UPDATER,
        customFields: [IssuesFake.CUSTOM_FIELDS],
      } as IIssue;
    },
    setGetQueryYoutrack: async (
      url: string,
      config: Record<string, unknown>,
    ): Promise<IProject[]> => {
      return [
        {
          id: ProjectFake.ID,
          name: ProjectFake.NAME,
          hubResourceId: ProjectFake.HUB_RESOURCE_ID,
        } as IProject,
      ];
    },
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        HttpYoutrackModule.forRootAsync({
          useFactory: async (configService: ConfigService) => ({
            baseURL: configService.config.HUB_BASE_URL,
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
      .overrideProvider(HttpYoutrackService)
      .useValue(httpYoutrackServiceMock)
      .compile();

    httpYoutrackService = moduleRef.get<HttpYoutrackService>(
      HttpYoutrackService,
    );
  });

  it('get a list of users http', async () => {
    const actualResult = await httpYoutrackService.getListUserHttp();
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
    const actualResult = await httpYoutrackService.getListProjectHttp();
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
    const actualResult = await httpYoutrackService.getListIssueHttp();
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
    const actualResult = await httpYoutrackService.getListIssueTrackHttp(
      ISSUE_ID,
    );
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
    const actualResult = await httpYoutrackService.getIssueHttp(ISSUE_ID);
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

  it('get query youtrack', async () => {
    const actualResult = await httpYoutrackService.setGetQueryYoutrack<
      IProject[]
    >('/admin/projects', {
      headers: ConfigFake.HEADERS,
      params: ConfigFake.PARAMS,
    });
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
});
