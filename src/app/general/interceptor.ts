import { from, Observable } from 'rxjs';
 import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler } from '@angular/common/http';
 import { Storage } from "@capacitor/storage";
@Injectable()
export class Interceptor implements HttpInterceptor {
  //#region Declrations
  userData: any;
  //#endregion
  //#region Constructor
  constructor() {
  }
  //#endregion
  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handle(httpRequest, next));
  }


  async handle(req: HttpRequest<any>, next: HttpHandler) {
     let user = (await Storage.get({ key: "user" })).value;
    if (user) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + JSON.parse(user).token,
          userId:`${JSON.parse(user).userId}`
        }
      })
      return next.handle(authReq).toPromise()
    } else {
      const authReq = req.clone({
        setHeaders: {
          Authorization: '{}',
          userId:'0'
        }
      })
      return next.handle(authReq).toPromise();
    }
  }
}