import { Subscription } from 'rxjs';
import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PublicService } from '../general/public.service';
import { AlertController, ModalController } from '@ionic/angular';
import { CategoryFormPage } from '../category-form/category-form.page';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage {

  //#region Declration
  categories: any[] = [];
  subscriptions: Subscription = new Subscription();
  //#endregion

  //#region Constrator
  constructor(
    private publicService: PublicService,
    private moduleControler: ModalController,
    private alertMessage: AlertController
  ) { }
  //#endregion
 
  //#region  ionic life cycle
  ionViewDidLeave() {
    this.subscriptions.unsubscribe();
  }

  async ionViewDidEnter() {
    this.subscriptions = new Subscription();
    await this.getAllCategories();
  }
  //#endregion
  
  //#region Methods
  async getAllCategories() {
    await this.publicService.loading();
    await this.subscriptions.add(this.publicService.getMethod('Categories').subscribe(async (response: any) => {
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

  async addNewCategory(itemState: string) {
    let addCategory = this.moduleControler.create({
      component: CategoryFormPage,
      componentProps: { itemState: itemState }
    });
    (await addCategory).onDidDismiss().then(async (data) => {
      if (data.data) this.categories.push(data.data);
    });
    (await addCategory).present();
  }
  async updateCategory(category: any) {
    let addCategory = this.moduleControler.create({
      component: CategoryFormPage,
      componentProps: { category: category }
    });
    (await addCategory).onDidDismiss().then(async (data) => {
      if (data.data) this.getAllCategories();
    });
    (await addCategory).present();
  }
  async confirmDeleteMessage(category: any) {
    var alert = await this.alertMessage.create({
      header: "Confirm",
      message: "Are You Sure You Want Confirm Delete",
      buttons: [
        {
          text: "Ok",
          handler: () => {
            this.deleteCategory(category);
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
  async deleteCategory(category: any) {
    await this.publicService.loading();
    this.subscriptions.add(this.publicService.deleteMethod(`Categories/${category.id}`).subscribe(async (response: any) => {
      if (response.success) {
        this.categories = await this.categories.filter(c => c.id !== category.id);
        this.publicService.showSussessToast(response.message);
      } else {
        this.publicService.showErrorAlert("Error", response.message)
      }
      await this.publicService.killLoading();
    }, async (error: HttpErrorResponse) => {
      this.publicService.showErrorAlert("Error", error.message);
      await this.publicService.killLoading();
    }))
  }
  //#endregion 

}
