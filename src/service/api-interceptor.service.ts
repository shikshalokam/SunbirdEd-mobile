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
        // let accessToken;
        // console.log("checkout outsideee");
        // if (req.url.includes('kendra-service')) {
        //     window.GenieSDK.auth.getSessionData(
        //         success => {
        //             console.log("Inside access token")
        //             accessToken = (success && JSON.parse(success)) ? JSON.parse(success).access_token : "";
        //         })
        //     console.log("before request")
        //     console.log(req)
        //     req = req.clone({
        //         setHeaders: {
        //             'Authorization': 'Bearer ' + accessToken,
        //             'X-authenticated-user-token': accessToken,
        //             'X-Channel-id': '0125747659358699520'
        //         }
        //     });
        // }

        // return this.slUtils.getToken.mergeMap(tokens => {
        //     return next.handle(req).do(evt => {
        //         if (evt instanceof HttpResponse) {
        //             console.log('---> status:', evt.status);
        //             console.log('---> filter:', req.params.get('filter'));
        //         }
        //     });
        // })

        // console.log("after request")

    }

    getAccessToken(): Promise<any> {
        return new Promise((resolve, reject) =>{
          window.GenieSDK.auth.getSessionData(
            success => {
              console.log("in promise")
              console.log(success);
              const accessToken = success ? JSON.parse(success).access_token : "";
              resolve (accessToken)
              // console.log(accessToken);
              // const httpOptions = {
              //   headers: new HttpHeaders({
              //   'Content-Type': 'application/json',
              //   'Authorization': 'Bearer '+ accessToken,
              //   'X-authenticated-user-token': accessToken,
              //   'X-Channel-id': '0125747659358699520'
              //   })
              // };
              // console.log(httpOptions)
              // return httpOptions
            }
          )
        })
    
      }

    async handle(req: HttpRequest<any>, next: HttpHandler) {
        // if your getAuthToken() function declared as "async getAuthToken() {}"
        if(req.url.includes('kendra-service')){
            // const token = await this.getAccessToken();
            const token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJwZU9VQ3ZTVUR2ekprYzlyeXJVNTNWLXV6ME1nOFVCbk4tSzJfTmFpX2N3In0.eyJqdGkiOiJjMjMzZDY1MC1mYzQyLTQxMGQtYjM5Ny00Yzg2YTNmMTUwZmMiLCJleHAiOjE1Nzk5MjExMjgsIm5iZiI6MCwiaWF0IjoxNTc5ODM0NzI4LCJpc3MiOiJodHRwczovL2Rldi5zaGlrc2hhbG9rYW0ub3JnL2F1dGgvcmVhbG1zL3N1bmJpcmQiLCJhdWQiOiJzbC1pb25pYy1jb25uZWN0Iiwic3ViIjoiZTk3YjU1ODItNDcxYy00NjQ5LTg0MDEtM2NjNDI0OTM1OWJiIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2wtaW9uaWMtY29ubmVjdCIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6ImNiYWJjZDZlLWYwOTEtNDQwYi1hYzkyLTdhMGNkZmNlMDUxZiIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwLyoiLCIqIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sIm5hbWUiOiJTYW5kZWVwIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYTFAc2hpa3NoYWxva2FtZGV2IiwiZ2l2ZW5fbmFtZSI6IlNhbmRlZXAiLCJmYW1pbHlfbmFtZSI6IiIsImVtYWlsIjoiYTFAc2hpa3NoYWxva2FtZGV2LmRldiJ9.B8BTnCOpSwhPflQb8ZKV85gPMzl8CHtmLGVFxtLgQaE6mLbZqGNJSy9k1ukBoIH0rGPnPXvgXe2f5IVNI6dw8ti0YEevXCNFNkVE_b1iskkmTBpc1tkmy4bNBXjt5vY63pXmWMmzK8wnYcK9xoG1fShNCWC-17aEwfO3gpXIHORJXW3mK8HBgDybw3ZablI6CSEKdTEOBDww852K16VG70ZRBpJLwLOMXtNSGDqyFkAzrALDu-S_9bPvA34m1gS4l1ZjmC9iVJArI30InlEddrowT-NvbR-mCFXJT8KfLw_cSKvnpxguA8zUP5EMFWbQaRWbADl5C16bbC9Tei1Maw"
            console.log("========== header token =============");
            console.log(token)
            // if your getAuthToken() function declared to return an observable then you can use
            // await this.auth.getAuthToken().toPromise()
            // let accessToken = (token && JSON.parse(token)) ? JSON.parse(token).access_token : "";
            req = req.clone({
                setHeaders: {
                    'Authorization': 'Bearer ' + token,
                    'X-authenticated-user-token': token,
                    'X-Channel-id': '0125747659358699520'
                }
            })
        } else {

        }
  

        // Important: Note the .toPromise()
        return next.handle(req).toPromise()
    }
}