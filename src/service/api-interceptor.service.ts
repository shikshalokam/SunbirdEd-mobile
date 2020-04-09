import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse }
    from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { from } from 'rxjs/observable/from';

declare const  window; 

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
    constructor() {

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return from(this.handle(req, next))
  

    }

    getAccessToken(): Promise<any> {
        return new Promise((resolve, reject) =>{
          window.GenieSDK.auth.getSessionData(
            success => {
              const accessToken = (success && JSON.parse(success)) ? JSON.parse(success).access_token : "";
              resolve (accessToken)
            }
          )
        })
    
      }

    async handle(req: HttpRequest<any>, next: HttpHandler) {
        if(req.url.includes('kendra')){
            const token = await this.getAccessToken();
            req = req.clone({
                setHeaders: {
                    'Authorization': 'Bearer ' + token,
                    'X-authenticated-user-token': token,
                    'X-Channel-id': '0125747659358699520'
                }
            })
        } else {

        }
  

        return next.handle(req).toPromise()
    }
}