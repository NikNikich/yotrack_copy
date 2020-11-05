import { Injectable, Logger } from '@nestjs/common';
import { ProjectRepository } from '../database/repository/project.repository';
import { get, isNil, toNumber } from 'lodash';
import { ConfigService } from '../config/config.service';
import { DirectionRepository } from '../database/repository/direction.repository';
import { ProjectInformationRepository } from '../database/repository/project-information.repository';
import { ISheetInformation } from './spreed-sheet.interface';
import { SPREED_HEADERS } from './spreed-sheet.const';
import { ProjectInformationEntity } from '../database/entity/project-information.entity';
import { GoogleExcelClient } from '../google-excel/google-excel.client';
import { GoogleSpreadsheetRow } from 'google-spreadsheet';

@Injectable()
export class SpreadSheetService {
  private readonly logger = new Logger(SpreadSheetService.name);

  constructor(
    private readonly googleExcelClient: GoogleExcelClient,
    private readonly directionRepository: DirectionRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly projectInformationRepository: ProjectInformationRepository,
    private readonly configService: ConfigService,
  ) {}

  async updateProjectInfo(): Promise<void> {
    await this.projectInformationRepository.truncateTable();
    await this.getProjectInfo();
  }

  async getProjectInfo(): Promise<void> {
    const sheetInfos = await this.getSheetInfo();
    const isExistSheetInfos = sheetInfos && sheetInfos.length > 0;
    if (isExistSheetInfos) {
      const projectInforms = await Promise.all(
        sheetInfos.map(
          async (
            sheetInfo: ISheetInformation,
          ): Promise<ProjectInformationEntity> => {
            return new ProjectInformationEntity({
              projectId: await this.getIdProject(sheetInfo.project),
              directionId: await this.getIdDirection(sheetInfo.direction),
              rate: this.getNumber(sheetInfo.rate),
              projectEstimation: this.getNumber(sheetInfo.projectEstimation),
            });
          },
        ),
      );
      await this.projectInformationRepository.save(projectInforms);
    }
  }

  async getSheetInfo(): Promise<ISheetInformation[]> {
    await this.googleExcelClient.useApiKey(
      this.configService.config.GOOGLE_API_KEY,
    );
    try {
      await this.googleExcelClient.loadInfo();
      const sheet = this.googleExcelClient.sheetsByIndex[0];
      const rows = await sheet.getRows();
      return rows.map(
        (row: GoogleSpreadsheetRow): ISheetInformation => {
          return {
            direction: !isNil(get(row, SPREED_HEADERS.direction))
              ? get(row, SPREED_HEADERS.direction)
              : null,
            project: !isNil(get(row, SPREED_HEADERS.project))
              ? get(row, SPREED_HEADERS.project)
              : null,
            projectEstimation: !isNil(
              get(row, SPREED_HEADERS.projectEstimation),
            )
              ? get(row, SPREED_HEADERS.projectEstimation)
              : null,
            rate: !isNil(get(row, SPREED_HEADERS.rate))
              ? get(row, SPREED_HEADERS.rate)
              : null,
          };
        },
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async getIdProject(name: string): Promise<number> {
    const findProject = await this.projectRepository.findOne({
      where: { name },
    });
    if (!findProject) {
      return null;
    }
    return findProject.id;
  }

  private async getIdDirection(name: string): Promise<number> {
    const findProject = await this.directionRepository.findOne({
      where: { name },
    });
    if (!findProject) {
      return null;
    }
    return findProject.id;
  }

  private getNumber(stringNumber: string): number {
    if (isNil(stringNumber)) {
      return null;
    }
    stringNumber = stringNumber.replace(',', '.').replace(/\s+/g, '');
    return toNumber(stringNumber);
  }
}
