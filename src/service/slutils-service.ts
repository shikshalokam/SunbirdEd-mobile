import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '@app/config/appConfig';

/*
  Generated class for the SlutilsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SlutilService {

  constructor(public http: HttpClient) {
    console.log('Hello SlutilsProvider Provider');
  }


  filterOutEkStepContent(allContents: Array<any>) {
    const filteredArray: Array<any> = [];
    for (const content of allContents) {
      if (content.channel !== "in.ekstep") {
        filteredArray.push(content);
      }
    }
    return filteredArray
  }

  apiMiddleWare(payload: any): Promise<any> {
    const url: string = AppConfig.apiBaseUrl+ AppConfig.baseUrls.kendraUrl + AppConfig.apiConstants.middleware;
    const headers = {
      "X-Channel-Id": AppConfig.rootOrgId,
      "ts": new Date(),
      "X-Org-code": AppConfig.rootOrgId,
      "X-App-Id": "production.production.mobile",
      "Content-Type": "application/json",
      "Accept": "application/json",
      "X-Source": "app"
    };

    payload.headers = headers;

    return new Promise((resolve, reject) => {
      this.http.post(url, payload).subscribe(success => {
        console.log(success)
        resolve(success['result'].result.response);
      }, error => {
        reject(error)
      })
    })

  }

}
