import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { PublicService } from 'src/app/general/public.service';
import { Storage } from "@capacitor/storage";
import { HttpErrorResponse } from '@angular/common/http';
const helper = new JwtHelperService();
const TOKEN_Key = "token";
@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  loginForm: FormGroup;
  isSubmitted = false;
  isSignup: boolean = false;
  constructor(
    private _formBuilder: FormBuilder,
    public router: Router,
    public publicService: PublicService,
    public messageService: AlertController) {
    // change lang to ar
  }

  ngOnInit() {
    this.loginForm = this._formBuilder.group({
      UserName: ['', [Validators.required, Validators.minLength(4)]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      ConfirmPassword:['', [Validators.minLength(6)]]
    });

  }

  get errorControl() {
    return this.loginForm.controls;
  }


  async submitLoginForm() {
    this.isSignup ? this.signupHttp() : this.signinHttp();
  }

  async signinHttp() {
    await this.publicService.loading();
    this.publicService.postMethod('users/signin', this.loginForm.value).subscribe(async (res: any) => {
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
      this.publicService.postMethod('users/signup', this.loginForm.value).subscribe(async (res: any) => {
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

}
