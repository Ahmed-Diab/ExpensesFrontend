import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PublicService } from 'src/app/general/public.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  isSubmitted = false;
  userData: any = {
    userName: "",
    password: ""
  }
  constructor(
    public router: Router,
    public publicService: PublicService,
    public messageService: AlertController) {
    // change lang to ar
  }

  ngOnInit() { }
  async submitSignupForm() {
    this.signinHttp();
  }

  async signinHttp() {
    this.publicService.loading().then(async () => {
      this.publicService.postMethod('users/signup', this.userData).subscribe(async (res: any) => {
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
}
