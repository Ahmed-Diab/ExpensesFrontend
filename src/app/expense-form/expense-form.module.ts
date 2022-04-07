import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ExpenseFormPage } from './expense-form.page';
import { ExpenseFormPageRoutingModule } from './expense-form-routing.module';

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
