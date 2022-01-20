import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
 import { ExpenseFormPage } from '../expense-form/expense-form.page';
 @Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(
    public _moduleControler:ModalController
  ) {}


  async addNewExpense(itemState: string) {
    let addExpense = this._moduleControler.create({
      component: ExpenseFormPage,
      cssClass: 'overlay-width',
      componentProps: {itemState: itemState}
    });
    (await addExpense).onDidDismiss().then(async (data) => {
      if (data.data) {
      }
    });
    (await addExpense).present();
  }

}
