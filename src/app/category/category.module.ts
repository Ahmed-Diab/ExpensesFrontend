import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { CategoryPageRoutingModule } from './category-routing.module';
import { CategoryPage } from './category.page';
import { CategoryFormPageModule } from '../category-form/category-form.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoryPageRoutingModule,
    CategoryFormPageModule
  ],
  declarations: [CategoryPage]
})
export class CategoryPageModule {}
