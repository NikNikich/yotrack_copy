import { HttpService, Injectable } from '@nestjs/common';
import { ReducedIssue, Youtrack } from 'youtrack-rest-client';
import { UserEntity } from '../database/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DirectionEntity } from '../database/entity/direction.entity';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ConfigService } from '../config/config.service';
import { IUser } from './youtrack.interface';
import {keysIn, merge, keys} from 'lodash';

@Injectable()
export class YoutrackService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(DirectionEntity)
    private readonly directionRepository: Repository<DirectionEntity>,
    private readonly hubHTTP: HttpService,
    private readonly youtrackClient: Youtrack,
    private readonly configService: ConfigService
  ) {
  }

  private top = 100;
  private headers={
    "Authorization": "Bearer " + this.configService.config.YOUTRACK_TOKEN
  };

  async addNewUsers(page = 1): Promise<void> {
    const usersYoutrack = await this.getListUserHttp(
      this.top * (page - 1),
       this.top
  );
    if (usersYoutrack.length>0) {
      const users = usersYoutrack.map((user) => {
        return new UserEntity({
          youtrackId: user.id,
          hubId: user.ringId,
          fullName: user.fullName
        })
      })
      await this.userRepository.save(users);
    }
    if (usersYoutrack.length === this.top) {
      await this.addNewUsers(page++);
    }
  }

  async addNewProjects(page = 1): Promise<void> {
    const usersYoutrack = await this.getListUserHttp(
      this.top * (page - 1),
      this.top
    );
    if (usersYoutrack.length>0) {
      const users = usersYoutrack.map((user) => {
        return new UserEntity({
          youtrackId: user.id,
          hubId: user.ringId,
          fullName: user.fullName
        })
      })
      await this.userRepository.save(users);
    }
    if (usersYoutrack.length === this.top) {
      await this.addNewUsers(page++);
    }
  }

  async getListUserHttp(skip?: number, top?: number): Promise<IUser[]> {
    let response = undefined;
    const iUser: IUser = {id:'1', ringId:'', fullName:''};
    let params = {"fields": keys(iUser).join(",")};
    if(skip){
      params = merge(params, {'$skip': skip});
    }
    if(top){
      params = merge(params,  {'$top': top});
    }
    try {
      response = await this.hubHTTP.get('/users',{
        headers: this.headers,
        params: params
      }).pipe().toPromise();
       response = response.data;
    } catch (error) {
      console.error(error);
    }
    return response;
  }

  async getListProjectHttp(skip?: number, top?: number): Promise<IUser[]> {
    let response = undefined;
    const iUser: IUser = {id:'1', ringId:'', fullName:''};
    let params = {"fields": keys(iUser).join(",")};
    if(skip){
      params = merge(params, {'$skip': skip});
    }
    if(top){
      params = merge(params,  {'$top': top});
    }
    try {
      response = await this.hubHTTP.get('/users',{
        headers: this.headers,
        params: params
      }).pipe().toPromise();
      response = response.data;
    } catch (error) {
      console.error(error);
    }
    return response;
  }

  async getListIssue(query?: string): Promise<ReducedIssue[]> {
    if (query) {
      return this.youtrackClient.issues.search(query);
    }
    return this.youtrackClient.issues.search('project: TR and updated: Today');
  }

  private async getIdDirection( direction: string): Promise<number>{
    let findDirection = await this.directionRepository.findOne({where:{name: direction}});
    if (!findDirection){
      findDirection =  await this.directionRepository.save(new DirectionEntity({name:direction}) )
    }
    return findDirection.id;
  }
}