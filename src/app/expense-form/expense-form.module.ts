import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpenseFormPageRoutingModule } from './expense-form-routing.module';

import { ExpenseFormPage } from './expense-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExpenseFormPageRoutingModule
  ],
  declarations: [ExpenseFormPage]
})
export class ExpenseFormPageModule {}
