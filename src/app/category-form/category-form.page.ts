import { Subscription } from 'rxjs';
import { Component } from '@angular/core';
import { Storage } from "@capacitor/storage";
import { HttpErrorResponse } from '@angular/common/http';
import { PublicService } from '../general/public.service';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.page.html',
  styleUrls: ['./category-form.page.scss'],
})
export class CategoryFormPage {
  
  //#region Declration
  name: string = '';
  category: any = null;
  subscriptions: Subscription = new Subscription();
  //#endregion

  //#region Constrator
  constructor(
    private navParams: NavParams,
    public publicService: PublicService,
    private modalController: ModalController
  ) { }
  //#endregion 

  //#region Ionic Life Cycle
  ionViewDidLeave() {
    this.subscriptions.unsubscribe();
  }
  async ionViewDidEnter() {
    this.subscriptions = new Subscription();
    this.category = await this.navParams.get("category");
    if (this.category) {
      this.name = this.category.name;
    }
  }
  //#endregion

  //#region Methods
  async submitCategory() {
    this.category != null ? this.updateCategory() : this.addNewCategory();
  }

  async addNewCategory() {
    let user = JSON.parse((await Storage.get({ key: "user" })).value);
    let data = {
      name: this.name,
      userId: user.userId
    }
    this.subscriptions.add(this.publicService.postMethod('Categories', data).subscribe((response: any) => {
      if (response.success) {
        this.modalController.dismiss(response.data);
        this.publicService.showSussessToast(response.message)
      } else {
        this.publicService.showErrorAlert("Error", response.message)
      }
    }, (error: HttpErrorResponse) => {
      this.publicService.showErrorAlert("Error", error.message)
    }))
  }

  async updateCategory() {
    let data = {
      name: this.name
    }
    this.subscriptions.add(this.publicService.updateMethod(`Categories/${this.category.id}`, data).subscribe((response: any) => {
      if (response.success) {
        this.modalController.dismiss(response.data);
        this.publicService.showSussessToast(response.message)
      } else {
        this.publicService.showErrorAlert("Error", response.message)
      }
    }, (error: HttpErrorResponse) => {
      this.publicService.showErrorAlert("Error", error.message)
    }))
  }

  //#endregion

}
