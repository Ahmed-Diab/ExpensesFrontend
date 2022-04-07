import { Subscription } from 'rxjs';
import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { PublicService } from '../general/public.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ExpenseFormPage } from '../expense-form/expense-form.page';
import { ImageViewComponent } from '../image-view/image-view.component';

@Component({
  selector: 'app-expenses',
  templateUrl: 'expenses.page.html',
  styleUrls: ['expenses.page.scss']
})
export class ExpensesPage {
  //#region Declrations
  expenses: any[] = [];
  categories: any[] = [];
  subscriptions: Subscription = new Subscription();
  //#endregion

  //#region Constractor
  constructor(
    public publicService: PublicService,
    public sanitizer: DomSanitizer,
    public alertMessage: AlertController,
    public moduleControler: ModalController,
  ) { }
  //#endregion

  //#region Ionic Life Cycle
  ionViewDidLeave() {
    this.subscriptions.unsubscribe();
  }

  ionViewDidEnter() {
    this.subscriptions = new Subscription();
    this.getAllExpenses();
  }
  //#endregion

  //#region Methods
  async displayImage(expense: any) {
    let modal = this.moduleControler.create({
      component: ImageViewComponent,
      componentProps: { expense: expense }
    });
    (await modal).present();
  }
  async getAllCategories() {
    await this.publicService.loading();
    this.subscriptions.add(this.publicService.getMethod('Categories').subscribe(async (response: any) => {
      if (response.success) {
        this.categories = [];
        if (response.data.length > 0) {
          this.categories.push(...response.data);
        }
      } else {
        this.publicService.showErrorAlert("Error", response.message)
      }
      await this.publicService.killLoading();
    }, async (error: HttpErrorResponse) => {
      await this.publicService.killLoading();
      this.publicService.showErrorAlert("Error", error.message)
    }))
  }

  async getAllExpenses() {
    await this.publicService.loading();
    this.subscriptions.add(this.publicService.getMethod('Expenses').subscribe(async (response: any) => {
      if (response.success) {
        this.expenses = response.data;
        this.getAllCategories()
      } else {
        this.publicService.showErrorAlert("Error", response.message)
      }
      await this.publicService.killLoading();
    }, async (error: HttpErrorResponse) => {
      await this.publicService.killLoading();
      this.publicService.showErrorAlert("Error", error.message)
    }))
  }


  async addNewExpense() {
    let addExpense = this.moduleControler.create({
      component: ExpenseFormPage,
      componentProps: { categories: this.categories }
    });
    (await addExpense).onDidDismiss().then(async (data) => {
      if (data.data) this.getAllExpenses();
    });
    (await addExpense).present();
  }


  async confirmDeleteMessage(category: any) {
    var alert = await this.alertMessage.create({
      header: "Confirm",
      message: "Are You Sure You Want Confirm Delete ",
      buttons: [
        {
          text: "Ok",
          handler: () => {
            this.deleteExpense(category);
          }
        },
        {
          text: "Cancle",
          role: "Cancle",
          handler: () => { }
        }
      ]
    });
    alert.present();
  }

  deleteExpense(expense: any) {
    this.subscriptions.add(this.publicService.deleteMethod(`Expenses/${expense.id}`).subscribe(async (response: any) => {
      if (response.success) {
        this.expenses = await this.expenses.filter(c => c.id !== expense.id);
        this.publicService.showSussessToast(response.message);
      } else {
        this.publicService.showErrorAlert("Error", response.message)
      }
    }, (error: HttpErrorResponse) => {
      this.publicService.showErrorAlert("Error", error.message)
    }))
  }

  async updateExpense(expense: any) {
    let addExpense = this.moduleControler.create({
      component: ExpenseFormPage,
      componentProps: { expense: expense, categories: this.categories }
    });
    (await addExpense).onDidDismiss().then(async (data) => {
      if (data.data) this.ionViewDidEnter();
    });
    (await addExpense).present();
  }
  //#endregion

}
