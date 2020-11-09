import { YoutrackService } from '../youtrack.service';
import { Test } from '@nestjs/testing';
import { YoutrackModule } from '../youtrack.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '../../config/config.service';
import { ConfigModule } from '../../config/config.module';
import { ItemEntity } from '../../database/entity/item.entity';
import { ICustomFields, IIssue, ITimeTracking } from '../youtrack.interface';
import { TimeTrackingEntity } from '../../database/entity/time-tracking.entity';
import {
  BD_ISSUE_Id_FAKE,
  CustomFieldsFake,
  IssueFake,
  ItemEntityFake,
  NEW_ALWAYS_FAKE,
  TimeTrackingEntityFake,
  TimeTrackingFake,
} from './test.constant';

describe('YoutrackService', () => {
  let youtrackService: YoutrackService;
  const youtrackServiceMock = {
    addNewIssueOne: async (
      issue: IIssue,
      newAlways,
      BDIssueId,
    ): Promise<ItemEntity> => {
      return new ItemEntity({
        name: ItemEntityFake.NAME,
        youtrackId: ItemEntityFake.YOUTRACK_ID,
      });
    },
    setCustomFieldsIssue: async (
      customFields: ICustomFields[],
      item: ItemEntity,
    ): Promise<ItemEntity> => {
      return new ItemEntity({
        name: ItemEntityFake.NAME,
        youtrackId: ItemEntityFake.YOUTRACK_ID,
      });
    },
    addIssueTimeTrack: async (
      issue: ItemEntity,
      youtrackTrack: ITimeTracking,
    ): Promise<TimeTrackingEntity> => {
      return new TimeTrackingEntity({
        text: TimeTrackingEntityFake.TEXT,
        youtrackId: TimeTrackingEntityFake.YOUTRACK_ID,
      });
    },
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        YoutrackModule,
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
      .overrideProvider(YoutrackService)
      .useValue(youtrackServiceMock)
      .compile();

    youtrackService = moduleRef.get<YoutrackService>(YoutrackService);
  });

  it('add new issue', async () => {
    const issue = {
      id: IssueFake.ID,
      summary: IssueFake.SUMMARY,
      project: IssueFake.PROJECT,
      parent: IssueFake.PARENT,
      updater: IssueFake.UPDATER,
      customFields: [IssueFake.CUSTOM_FIELDS],
    };
    const actualResult = await youtrackService.addNewIssueOne(
      issue,
      NEW_ALWAYS_FAKE,
      BD_ISSUE_Id_FAKE,
    );
    const expectResult = new ItemEntity({
      name: ItemEntityFake.NAME,
      youtrackId: ItemEntityFake.YOUTRACK_ID,
    });
    expect(actualResult).toEqual(expectResult);
  });

  it('set custom fields issue', async () => {
    const customFields = {
      id: CustomFieldsFake.ID,
      name: CustomFieldsFake.NAME,
      value: CustomFieldsFake.VALUE,
    };
    const setCustomFields = {
      name: ItemEntityFake.NAME,
      youtrackId: ItemEntityFake.YOUTRACK_ID,
    };
    const actualResult = await youtrackService.setCustomFieldsIssue(
      [customFields],
      setCustomFields,
    );
    const expectResult = new ItemEntity({
      name: ItemEntityFake.NAME,
      youtrackId: ItemEntityFake.YOUTRACK_ID,
    });
    expect(actualResult).toEqual(expectResult);
  });

  it('add new issue time track', async () => {
    const issue = {
      name: ItemEntityFake.NAME,
      youtrackId: ItemEntityFake.YOUTRACK_ID,
    };
    const youtrackTrack = {
      id: TimeTrackingFake.ID,
      text: TimeTrackingFake.TEXT,
      duration: TimeTrackingFake.DURATION,
      created: TimeTrackingFake.CREATED,
      author: TimeTrackingFake.AUTHOR,
      date: TimeTrackingFake.DATE,
    };
    const actualResult = await youtrackService.addIssueTimeTrack(
      issue,
      youtrackTrack,
    );
    const expectResult = new TimeTrackingEntity({
      text: TimeTrackingEntityFake.TEXT,
      youtrackId: TimeTrackingEntityFake.YOUTRACK_ID,
    });
    expect(actualResult).toEqual(expectResult);
  });
});
