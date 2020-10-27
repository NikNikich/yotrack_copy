import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../database/repository/project.repository';
import { get, isNil, toNumber } from 'lodash';
import { ConfigService } from '../config/config.service';
import { DirectionRepository } from '../database/repository/direction.repository';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { ProjectInformationRepository } from '../database/repository/project-information.repository';
import { ISheetInformation } from './spreed-sheet.interface';
import { SPREED_HEADERS } from './spreed-sheet.const';
import { ProjectInformationEntity } from '../database/entity/project-information.entity';

@Injectable()
export class SpreadSheetService {
  constructor(
    private readonly directionRepository: DirectionRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly projectInformationRepository: ProjectInformationRepository,
    private readonly configService: ConfigService,
  ) {}

  tableName = 'project_information';

  async updateProjectInfo(): Promise<void> {
    await this.projectInformationRepository.query(
      `TRUNCATE TABLE "${this.tableName}" CASCADE `,
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
    const doc = new GoogleSpreadsheet(
      '1RYabRn005y0v_hUvVUNT4GHyIs5xJT_F602hfVj0Ku8',
    );
    await doc.useApiKey(this.configService.config.GOOGLE_API_KEY);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
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
