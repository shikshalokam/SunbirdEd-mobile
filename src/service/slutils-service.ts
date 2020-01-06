import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
      if(content.channel !=="in.ekstep") {
        filteredArray.push(content);
      }
    }
    return filteredArray
  }

}
