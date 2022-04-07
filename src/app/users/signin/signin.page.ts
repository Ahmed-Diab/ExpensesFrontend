
import { Router } from '@angular/router';
import { Storage } from "@capacitor/storage";
import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpErrorResponse } from '@angular/common/http';
import { PublicService } from 'src/app/general/public.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const helper = new JwtHelperService();
const TOKEN_Key = "token";
@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage {

  //#region Declration
   isSubmitted = false;
  isSignup: boolean = false;
  user: any = {
    UserName: '',
    Password: '',
    ConfirmPassword: ''
  }
  //#endregion

  //#region Constractor
  constructor(
    public router: Router,
    public publicService: PublicService,
    public messageService: AlertController) {
  }
  //#endregion

  //#region Ionic Life Cycle
  ionViewDidEnter() {
  }
  //#endregion

  //#region Methods
 
  async submitLoginForm() {
    if (this.isSignup && this.user.Password != this.user.ConfirmPassword) {
      return this.publicService.showErrorAlert("Error", "Password filed not match with Confirm Password ");
    }
    this.isSignup ? this.signupHttp() : this.signinHttp();
  }

  async signinHttp() {
    await this.publicService.loading();
    this.publicService.postMethod('users/signin', this.user).subscribe(async (res: any) => {
      if (res.success) {
        await Storage.set({ key: "user", value: JSON.stringify(res.data) });
        this.router.navigate(['/tabs']);
      } else {

        this.publicService.showErrorAlert("Error", res.message);
      }
      await this.publicService.killLoading();
    }, async (error: HttpErrorResponse) => {
      await this.publicService.killLoading();
      if (error) {
        this.publicService.showErrorAlert("Error", error.message);
      }
    })
  }

  async signupHttp() {
    this.publicService.loading().then(async () => {
      this.publicService.postMethod('users/signup', this.user).subscribe(async (res: any) => {
        if (res.success) {
          await this.publicService.killLoading();
          this.router.navigate(['/signin']);
        } else {
          await this.publicService.killLoading();
          this.publicService.showErrorAlert("Error", res.message);
        }
      }, async (error: HttpErrorResponse) => {
        await this.publicService.killLoading();
        this.publicService.showErrorAlert("Error", error.message);
      })
    })
  }

  changePageState() {
    this.isSignup = !this.isSignup;
  }

  //#endregion

}
