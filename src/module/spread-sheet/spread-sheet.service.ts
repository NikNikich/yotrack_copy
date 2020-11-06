import { Inject, Injectable, Logger } from '@nestjs/common';
import { ProjectRepository } from '../database/repository/project.repository';
import { isNil, toNumber } from 'lodash';
import { DirectionRepository } from '../database/repository/direction.repository';
import { ProjectInformationRepository } from '../database/repository/project-information.repository';
import { ISheetInformation } from './spreed-sheet.interface';
import { ProjectInformationEntity } from '../database/entity/project-information.entity';
import { ISpreadSheetDS } from '../spread-sheet-ds/spread-sheet-ds.interface';
import { SPREAD_SHEET_DS_KEY } from '../spread-sheet-ds/spread-sheet-ds.const';

@Injectable()
export class SpreadSheetService {
  private readonly logger = new Logger(SpreadSheetService.name);

  constructor(
    @Inject(SPREAD_SHEET_DS_KEY)
    private readonly spreadSheetDs: ISpreadSheetDS,
    private readonly directionRepository: DirectionRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly projectInformationRepository: ProjectInformationRepository,
  ) {}

  async updateProjectInfo(): Promise<void> {
    await this.projectInformationRepository.truncateTable();
    await this.getProjectInfo();
  }

  async getProjectInfo(): Promise<void> {
    const sheetInfos = await this.spreadSheetDs.getSheetInfo();
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

  private async getIdProject(name: string): Promise<number | null> {
    const findProject = await this.projectRepository.findOne({
      where: { name },
    });
    if (!findProject) {
      return null;
    }
    return findProject.id;
  }

  private async getIdDirection(name: string): Promise<number | null> {
    const findProject = await this.directionRepository.findOne({
      where: { name },
    });
    if (!findProject) {
      return null;
    }
    return findProject.id;
  }

  private getNumber(stringNumber: string): number | null {
    if (isNil(stringNumber)) {
      return null;
    }
    stringNumber = stringNumber.replace(',', '.').replace(/\s+/g, '');
    return toNumber(stringNumber);
  }
}
