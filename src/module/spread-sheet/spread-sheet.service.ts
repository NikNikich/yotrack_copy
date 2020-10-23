import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../database/repository/project.repository';
import { ProjectTeamRepository } from '../database/repository/project-team.repository';
import { set,  get, isNil, toNumber } from 'lodash';
import { ConfigService } from '../config/config.service';
import { DirectionRepository } from '../database/repository/direction.repository';
import { GoogleSpreadsheet }  from 'google-spreadsheet';
import { ProjectInformationRepository } from '../database/repository/project-information.repository';
import { IIndexHeader, ISheetInformation } from './spreed-sheet.interface';
import { ISSUE_CUSTOM_FIELDS } from '../youtrack/youtrack.const';
import { SPREED_HEADERS } from './spreed-sheet.const';
import { ProjectEntity } from '../database/entity/project.entity';
import { ProjectInformationEntity } from '../database/entity/project-information.entity';

@Injectable()
export class SpreadSheetService {
  constructor(
    private readonly directionRepository: DirectionRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly projectInformationRepository: ProjectInformationRepository,
    private readonly configService: ConfigService,
  ) {
  }

  async getProjectInfo(): Promise<void> {
    const sheetInfos = await  this.getSheetInfo();
    if (sheetInfos.length > 0) {
      const projectInforms = await Promise.all(
        sheetInfos.map(async (sheetInfo)=> {
           return new ProjectInformationEntity({
              projectId: await this.getIdProject(sheetInfo.project),
              directionId: await this.getIdDirection(sheetInfo.direction),
              rate: toNumber(sheetInfo.rate.replace(',', '.')),
              projectEstimation: toNumber(sheetInfo.projectEstimation.replace(',', '.')),
            })}
        ));
      await this.projectInformationRepository.save(projectInforms);
    }
  }

  async getSheetInfo( ): Promise<ISheetInformation[]> {
    const doc = new GoogleSpreadsheet('1RYabRn005y0v_hUvVUNT4GHyIs5xJT_F602hfVj0Ku8');
    await doc.useApiKey(this.configService.config.GOOGLE_API_KEY);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]
    let indexHeader: IIndexHeader = {
      direction: null,
      project: null,
      rate: null,
      projectEstimation: null
    };
    const rows = await sheet.getRows();
    const headers = sheet.headerValues;
    headers.map((header, index ) => {
      const keyIssue = get(SPREED_HEADERS, header);
      if (!isNil(keyIssue)){
       set(indexHeader, keyIssue, index);
      }
    })
    return  rows.map((row) => {
     const rowData =  row._rawData
      return  {
      direction: !isNil(indexHeader.direction)?rowData[indexHeader.direction] : null,
      project: !isNil(indexHeader.project )?rowData[indexHeader.project] : null,
      projectEstimation: !isNil(indexHeader.projectEstimation)?rowData[indexHeader.projectEstimation] : null,
      rate: !isNil(indexHeader.rate)?rowData[indexHeader.rate] : null
    }});
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

  private async getIdDirection (name: string): Promise<number> {
    const findProject = await this.directionRepository.findOne({
      where: { name },
    });
    if (!findProject) {
      return null;
    }
    return findProject.id;
  }
}