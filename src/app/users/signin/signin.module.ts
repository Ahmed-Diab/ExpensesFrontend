import { NgModule } from '@angular/core';
import { SigninPage } from './signin.page';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { PublicService } from 'src/app/general/public.service';
import { SigninPageRoutingModule } from './signin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
