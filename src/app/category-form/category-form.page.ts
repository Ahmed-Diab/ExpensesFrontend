import { Subscription } from 'rxjs';
import { Storage } from "@capacitor/storage";
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PublicService } from '../general/public.service';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.page.html',
  styleUrls: ['./category-form.page.scss'],
})
export class CategoryFormPage {
  name: string = '';
  category: any = null;
  subscriptions: Subscription = new Subscription();

  constructor(
    private navParams: NavParams,
    public publicService: PublicService,
    private modalController: ModalController
  ) { }

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
}
