import { Test } from '@nestjs/testing';
import { SpreadSheetModule } from '../spread-sheet.module';
import { SpreadSheetService } from '../spread-sheet.service';
import { ISheetInformation } from '../spreed-sheet.interface';
import { SheetInformationFake } from './test.constant';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '../../config/config.service';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { ConfigModule } from '../../config/config.module';

describe('SpreadSheetService', () => {
  let spreadSheetService: SpreadSheetService;
  const spreadSheetServiceMock = {
    getSheetInfo: async (): Promise<ISheetInformation[]> => {
      return [
        {
          project: SheetInformationFake.PROJECT,
          direction: SheetInformationFake.DIRECTION,
          rate: SheetInformationFake.RATE,
          projectEstimation: SheetInformationFake.PROJECT_ESTIMATION,
        } as ISheetInformation,
      ];
    },
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        SpreadSheetModule,
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
      .overrideProvider(SpreadSheetService)
      .useValue(spreadSheetServiceMock)
      .compile();

    spreadSheetService = moduleRef.get<SpreadSheetService>(SpreadSheetService);
  });

  it('get sheet info', async () => {
    const actualResult = await spreadSheetService.getSheetInfo();
    const sortedActualResult = actualResult.sort();
    const iSheetInformation: ISheetInformation = {
      project: SheetInformationFake.PROJECT,
      direction: SheetInformationFake.DIRECTION,
      rate: SheetInformationFake.RATE,
      projectEstimation: SheetInformationFake.PROJECT_ESTIMATION,
    };
    const expectResult: ISheetInformation[] = [iSheetInformation];
    const sortedExpectResult = expectResult.sort();
    expect(sortedActualResult).toEqual(sortedExpectResult);
  });
});
