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
      Password: ['', [Validators.required, Validators.minLength(6)]]
    });

  }

  get errorControl() {
    return this.loginForm.controls;
  }


  async submitLoginForm() {

    this.signinHttp();
  }

  async signinHttp() {
    this.publicService.loading().then(async () => {
      this.publicService.postMethod('users/signin', this.loginForm.value).subscribe(async (res: any) => {
        if (res.success) {
          await Storage.set({ key: "user", value: JSON.stringify(res.data) });
          await this.publicService.killLoading();
             this.router.navigate(['/tabs']);
         }
      }, async (error: HttpErrorResponse) => {
        await this.publicService.killLoading();
        if (error) {
          this.publicService.showErrorAlert("حدث خطاء", error.message);
        }
      })
    })

  }



}
