import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CategoryFormPage } from './category-form.page';
import { CategoryFormPageRoutingModule } from './category-form-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoryFormPageRoutingModule
  ],
  declarations: [CategoryFormPage]
})
export class CategoryFormPageModule {}
