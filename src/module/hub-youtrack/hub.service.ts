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
  headers={
    "Authorization": "Bearer " + this.configService.config.HUB_TOKEN
  };

  async getListUsers(): Promise<Observable<AxiosResponse>> {
    let response = undefined;
    try {
      response = await this.hubHTTP.get('/users',{
        headers: this.headers
      }).pipe().toPromise();
      response = response.data.users;
    } catch (error) {
      console.error(error);
    }
    return response;
  }

  async getListRoles(): Promise<Observable<AxiosResponse>> {
    let response = undefined;
    try {
       response = await this.hubHTTP.get('/roles',{
         headers: this.headers
       }).pipe().toPromise();
       response = response.data.roles;
    } catch (error) {
      console.error(error);
    }
    return response;
  }

  async getListPermission(): Promise<Observable<AxiosResponse>> {
    let response = undefined;
    try {
      response = await this.hubHTTP.get('/permissions',{
        params:{
          fields: 'name,id'
        },
        headers: this.headers
      }).pipe().toPromise();
      response = response.data.permissions;
    } catch (error) {
      console.error(error);
    }
    return response;
  }
}