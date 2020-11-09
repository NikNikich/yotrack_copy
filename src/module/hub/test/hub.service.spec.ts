import { ProjectTeamEntity } from '../../database/entity/project-team.entity';
import { IIdName } from '../../youtrack/youtrack.interface';
import { HubService } from '../hub.service';
import { HubModule } from '../hub.module';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '../../config/config.service';
import { ConfigModule } from '../../config/config.module';
import { IdNameFake, ProjectTeamEntityFake } from './test.constant';

describe('YoutrackService', () => {
  let hubService: HubService;
  const hubServiceMock = {
    findAndAddUserTeam: async (
      newTeamEntity: ProjectTeamEntity,
      user: IIdName,
    ): Promise<ProjectTeamEntity> => {
      return new ProjectTeamEntity({
        name: ProjectTeamEntityFake.NAME,
        hubId: ProjectTeamEntityFake.HUB_ID,
        users: [ProjectTeamEntityFake.USERS],
      });
    },
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        HubModule,
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
      .overrideProvider(HubService)
      .useValue(hubServiceMock)
      .compile();

    hubService = moduleRef.get<HubService>(HubService);
  });

  it('add new issue', async () => {
    const newTeamEntity = {
      name: ProjectTeamEntityFake.NAME,
      hubId: ProjectTeamEntityFake.HUB_ID,
      users: [ProjectTeamEntityFake.USERS],
    };
    const user = {
      id: IdNameFake.ID,
      name: IdNameFake.NAME,
      summary: IdNameFake.SUMMARY,
    };
    const actualResult = await hubService.findAndAddUserTeam(
      newTeamEntity,
      user,
    );
    const expectResult = new ProjectTeamEntity({
      name: ProjectTeamEntityFake.NAME,
      hubId: ProjectTeamEntityFake.HUB_ID,
      users: [ProjectTeamEntityFake.USERS],
    });
    expect(actualResult).toEqual(expectResult);
  });
});
