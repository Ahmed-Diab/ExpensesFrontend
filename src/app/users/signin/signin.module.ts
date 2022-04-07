import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SigninPageRoutingModule } from './signin-routing.module';
import { SigninPage } from './signin.page';
import { PublicService } from 'src/app/general/public.service';
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SigninPageRoutingModule,
   ],
  providers:[PublicService],
  declarations: [SigninPage]
})
export class SigninPageModule {}
