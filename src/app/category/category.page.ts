import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { CategoryFormPage } from '../category-form/category-form.page';
import { PublicService } from '../general/public.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  categories: any[] = [];
  constructor(
    private publicService: PublicService,
    private moduleControler: ModalController,
    private alertMessage: AlertController
  ) { }

  ngOnInit() {
    this.getAllCategories();
  }


  getAllCategories() {
    this.publicService.getMethod('Categories').subscribe((response: any) => {
      if (response.success) {
        this.categories = [];
        this.categories.push(...response.data);
      } else {
        this.publicService.showErrorAlert("حدث خطاء", response.message)
      }
    }, (error: HttpErrorResponse) => {
      this.publicService.showErrorAlert("حدث خطاء", error.message)
    })
  }

  async addNewCategory(itemState: string) {
    let addCategory = this.moduleControler.create({
      component: CategoryFormPage,
      cssClass: 'overlay-width',
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
      cssClass: 'overlay-width',
      componentProps: { category: category }
    });
    (await addCategory).onDidDismiss().then(async (data) => {
      if (data.data)  this.ngOnInit();
    });
    (await addCategory).present();
  }


async  confirmDeleteMessage(category: any) {
   var alert = await this.alertMessage.create({
      header: "تأكيد",
      message: "هل انت متاكد من انك تريد اتمام عمليه الحذف",
      buttons: [
        {
          text: "موافق",
          handler: () => {
            this.deleteCategory(category);
          }
        },
        {
          text:"ألغاء",
          role:"Cancle",
          handler:()=>{}
        }
      ]
    });
    alert.present();
  }
  deleteCategory(category: any) {
    this.publicService.deleteMethod(`Categories/${category.id}`).subscribe(async (response: any) => {
       if (response.success) {
        this.categories = await this.categories.filter(c => c.id !== category.id);
        this.publicService.showSussessToast(response.message);
      } else {
        this.publicService.showErrorAlert("حدث خطاء", response.message)
      }
    }, (error: HttpErrorResponse) => {
      this.publicService.showErrorAlert("حدث خطاء", error.message)
    })
  }
}
