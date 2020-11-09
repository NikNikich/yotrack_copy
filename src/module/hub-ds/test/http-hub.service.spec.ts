import { HttpHubService } from '../http-hub.service';
import { IProjectTeam } from '../../hub/hub.interface';
import { Test } from '@nestjs/testing';
import { ProjectTeamFake } from './test.constant';
import { HttpHubModule } from '../http-hub.module';
import { ConfigService } from '../../config/config.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '../../config/config.module';

describe('HttpHubService', () => {
  let httpHubService: HttpHubService;
  const httpHubServiceMock = {
    getListProjectTeam: async (
      skip?: number,
      top?: number,
    ): Promise<IProjectTeam[]> => {
      return [
        {
          id: ProjectTeamFake.ID,
          name: ProjectTeamFake.NAME,
          users: ProjectTeamFake.USERS,
          project: ProjectTeamFake.PROJECT,
        } as IProjectTeam,
      ];
    },
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        HttpHubModule.forRootAsync({
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
      .overrideProvider(HttpHubService)
      .useValue(httpHubServiceMock)
      .compile();

    httpHubService = moduleRef.get<HttpHubService>(HttpHubService);
  });

  it('get a list of users http', async () => {
    const actualResult = await httpHubService.getListProjectTeam();
    const sortedActualResult = actualResult.sort();
    const iProjectTeam: IProjectTeam = {
      id: ProjectTeamFake.ID,
      name: ProjectTeamFake.NAME,
      users: ProjectTeamFake.USERS,
      project: ProjectTeamFake.PROJECT,
    };
    const expectResult: IProjectTeam[] = [iProjectTeam];
    const sortedExpectResult = expectResult.sort();
    expect(sortedActualResult).toEqual(sortedExpectResult);
  });
});
