import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Storage } from "@capacitor/storage";
import { formatDate } from '@angular/common';
import { catchError, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';

const TOKEN_Key = "token";
const helper = JwtHelperService;
@Injectable({
  providedIn: 'root'
})
export class PublicService {

  constructor(
    public router: Router,
    public http: HttpClient,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public modalController: ModalController
  ) {
  }

  getFullDate(date) {
    return formatDate(date, 'yyyy-MM-dd hh:mm:ss', 'en-US');
  }
  getShortDate(date) {
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  postMethod(url: string, request: any) {
    return this.http.post<any>(environment.apiURL + url, request).pipe(map((data: any) => { return data }));
  }
  updateMethod(url: string, request: any) {
    return this.http.put<any>(environment.apiURL + url, request).pipe(map((data: any) => { return data }));
  }

  getMethod(url: string) {
    return this.http.get<any>(environment.apiURL + url).pipe(map((data: any) => { return data }));
  }
  deleteMethod(url: string) {
    return this.http.delete<any>(environment.apiURL + url).pipe(map((data: any) => { return data }));
  }

  async loading() {
    await this.killLoading();
    const loading = await this.loadingController.create({
      cssClass: "loading",
      spinner: null,
      message: `
      <div class='spinner'> <div class='color-white' > Loading </div></div>`

    });
    return await loading.present();
  }

  async killLoading() {
    let isLoading = await this.loadingController.getTop();
    if (isLoading) {
      await this.loadingController.dismiss();
    }
  }
  async killModuleControlar() {
    await this.modalController.dismiss();
  }

  async showErrorAlert(header, errorMessage) {
    const alert = await this.alertController.create({
      header: header,
      message: errorMessage,
      buttons: [
        {
          text: "Ok",
          role: 'cancle',
          handler: () => { }
        }
      ]
    });
    await alert.present();
  }

  async showSussessToast(message: string) {
    let toast = await this.toastController.create({
      header: "Success Message",
      message: message,
      duration: 3000
    });
    toast.present();
  }

  async getDefultPayment() {
    const data = await Storage.get({ key: 'defultPayment' });
    if (data.value) {
      const df = data.value;
      return df;
    }
  }

  async getDefultBranch() {
    const data = await Storage.get({ key: 'defultBranch' });
    if (data.value) {
      const df = data.value;
      return df;
    }
  }
  async loginAngular(user) {
    let fullPath = `${environment.apiURL}api/users/auth`;
    return this.http.post(fullPath, { userName: user.UserName, password: user.Password }).pipe(
      catchError(this.handleError));
  }




  async CheckPermission(_code: number) {
    var permissions = (await this.getUser()).permissions;
    var per = await permissions.includes(_code);
    return per;

  }

  async getUser(): Promise<any> {
    const data = await Storage.get({ key: 'user' });
    if (data.value) {
      const user = JSON.parse(data.value);
      return user;
    } else {
      return null;
    }
  }
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      return throwError(
        'Something bad happened; please try again later.' + error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error}`);
    }
    return throwError(error);
  }

  async logout() {
    await Storage.remove({ key: 'user' });
    await Storage.remove({ key: 'settings' });
    this.router.navigate(['/']);
  }

}
