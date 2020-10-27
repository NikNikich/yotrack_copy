import { Inject, Injectable } from '@nestjs/common';
import { ProjectRepository } from '../database/repository/project.repository';
import { get, isNil, toNumber } from 'lodash';
import { ConfigService } from '../config/config.service';
import { DirectionRepository } from '../database/repository/direction.repository';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { ProjectInformationRepository } from '../database/repository/project-information.repository';
import { ISheetInformation } from './spreed-sheet.interface';
import { SPREED_HEADERS } from './spreed-sheet.const';
import { ProjectInformationEntity } from '../database/entity/project-information.entity';
import { GOOGLE_EXCEL_MODULE_OPTIONS } from '../google-excel/constant/google-excel.constant';
import { IGoogleExcelOptions } from '../google-excel/interface/google-excel-options-factory';

@Injectable()
export class SpreadSheetService {
  constructor(
    private readonly googleSpreadsheet: GoogleSpreadsheet,
    private readonly directionRepository: DirectionRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly projectInformationRepository: ProjectInformationRepository,
    private readonly configService: ConfigService,
  ) {}

  async updateProjectInfo(): Promise<void> {
    const tableName = this.projectInformationRepository.metadata.tableName;
    await this.projectInformationRepository.query(
      `TRUNCATE TABLE "${tableName}" CASCADE `,
    );
    await this.getProjectInfo();
  }

  async getProjectInfo(): Promise<void> {
    const sheetInfos = await this.getSheetInfo();
    if (sheetInfos.length > 0) {
      const projectInforms = await Promise.all(
        sheetInfos.map(async (sheetInfo) => {
          return new ProjectInformationEntity({
            projectId: await this.getIdProject(sheetInfo.project),
            directionId: await this.getIdDirection(sheetInfo.direction),
            rate: this.getNumber(sheetInfo.rate),
            projectEstimation: this.getNumber(sheetInfo.projectEstimation),
          });
        }),
      );
      await this.projectInformationRepository.save(projectInforms);
    }
  }

  async getSheetInfo(): Promise<ISheetInformation[]> {
    await this.googleSpreadsheet.useApiKey(
      this.configService.config.GOOGLE_API_KEY,
    );
    await this.googleSpreadsheet.loadInfo();
    const sheet = this.googleSpreadsheet.sheetsByIndex[0];
    const rows = await sheet.getRows();
    return rows.map((row) => {
      return {
        direction: !isNil(get(row, SPREED_HEADERS.direction))
          ? get(row, SPREED_HEADERS.direction)
          : null,
        project: !isNil(get(row, SPREED_HEADERS.project))
          ? get(row, SPREED_HEADERS.project)
          : null,
        projectEstimation: !isNil(get(row, SPREED_HEADERS.projectEstimation))
          ? get(row, SPREED_HEADERS.projectEstimation)
          : null,
        rate: !isNil(get(row, SPREED_HEADERS.rate))
          ? get(row, SPREED_HEADERS.rate)
          : null,
      };
    });
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
