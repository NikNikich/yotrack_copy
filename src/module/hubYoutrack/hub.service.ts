import { HttpService, Injectable } from '@nestjs/common';
import { ReducedIssue, Youtrack } from 'youtrack-rest-client';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ConfigService } from '../config/config.service';

@Injectable()
export class HubService {
  constructor(
    private readonly hubHTTP: HttpService,
    private readonly configService: ConfigService
  ) {
  }
  baseUrl = this.configService.config.HUB_BASE_URL;
  authorization = "Bearer " + this.configService.config.HUB_TOKEN;

  async getListUsers(): Promise<Observable<AxiosResponse>> {
    return this.hubHTTP.get(this.baseUrl+'/users');
  }

  async getListRoles(): Promise<Observable<AxiosResponse>> {
    let response = undefined;
    try {
       response = await this.hubHTTP.get(this.baseUrl+'/roles',{
         headers:{
           "Authorization": this.authorization
         }
       }).pipe().toPromise();
       response = response.data.roles;
    } catch (error) {
      console.error(error);
    }
    return response;
  }
}