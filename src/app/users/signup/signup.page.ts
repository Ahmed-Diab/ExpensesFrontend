import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from "@capacitor/storage";
import { AlertController } from '@ionic/angular';
import { PublicService } from 'src/app/general/public.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
   isSubmitted = false;
   userData:any = {
     userName:"",
     password:""
   }
  constructor(
     public router: Router,
    public publicService: PublicService,
    public messageService: AlertController) {
    // change lang to ar
  }

  ngOnInit() {
     

  }
  async submitSignupForm() {
    this.signinHttp();
  }

  async signinHttp() {
    this.publicService.loading().then(async () => {
      this.publicService.postMethod('users/signup', this.userData).subscribe(async (res: any) => {
        console.log("🚀 ~ file: signup.page.ts ~ line 37 ~ SignupPage ~ this.publicService.postMethod ~ res", res)
        if (res.success) {
           await this.publicService.killLoading();
             this.router.navigate(['/signin']);
         }else{
          await this.publicService.killLoading();
          this.publicService.showErrorAlert("حدث خطاء", res.message);
         }
      }, async (error: HttpErrorResponse) => {
        console.log("🚀 ~ file: signup.page.ts ~ line 46 ~ SignupPage ~ this.publicService.postMethod ~ error", error)
        await this.publicService.killLoading();
          this.publicService.showErrorAlert("حدث خطاء", error.message);      })
    })
  }
}
