import { NgModule } from '@angular/core';
import { ExpenseFormPage } from './expense-form.page';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ExpenseFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpenseFormPageRoutingModule {}
