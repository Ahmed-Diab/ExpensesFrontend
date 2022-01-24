import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { PublicService } from '../general/public.service';
import { Storage } from "@capacitor/storage";
@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.page.html',
  styleUrls: ['./category-form.page.scss'],
})
export class CategoryFormPage implements OnInit {
  name: string = '';
  category: any = null;
  constructor(
    private navParams: NavParams,
    private publicService: PublicService,
    private modalController: ModalController
  ) { }

  async ngOnInit() {
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
    this.publicService.postMethod('Categories', data).subscribe((response: any) => {
      if (response.success) {
        this.modalController.dismiss(response.data);
        this.publicService.showSussessToast(response.message)
      } else {
        this.publicService.showErrorAlert("حدث خطاء", response.message)
      }
    }, (error: HttpErrorResponse) => {
      this.publicService.showErrorAlert("حدث خطاء", error.message)
    })
  }

  async updateCategory() {
     let data = {
      name: this.name
    }
    this.publicService.updateMethod(`Categories/${this.category.id}`, data).subscribe((response: any) => {
      if (response.success) {
        this.modalController.dismiss(response.data);
        this.publicService.showSussessToast(response.message)
      } else {
        this.publicService.showErrorAlert("حدث خطاء", response.message)
      }
    }, (error: HttpErrorResponse) => {
      this.publicService.showErrorAlert("حدث خطاء", error.message)
    })
  }
}
