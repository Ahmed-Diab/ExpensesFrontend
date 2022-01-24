import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpensesPage } from './expenses.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { ExpensesPageRoutingModule } from './expenses-routing.module';
import { ExpenseFormPage } from '../expense-form/expense-form.page';
import { ExpenseFormPageModule } from '../expense-form/expense-form.module';
 @NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ExpensesPageRoutingModule,
    ExpenseFormPageModule
  ],
  declarations: [ExpensesPage],
  schemas:[],
  providers:[DatePipe]
})
export class ExpensesPageModule {}
