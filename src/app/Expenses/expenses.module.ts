import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ExpensesPage } from './expenses.page';
import { CommonModule, DatePipe } from '@angular/common';
import { ExpensesPageRoutingModule } from './expenses-routing.module';
import { ExpenseFormPageModule } from '../expense-form/expense-form.module';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExpensesPageRoutingModule,
    ExpenseFormPageModule
  ],
  declarations: [ExpensesPage],
  schemas: [],
  providers: [DatePipe]
})
export class ExpensesPageModule { }
