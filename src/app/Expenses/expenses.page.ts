import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController, ModalController } from '@ionic/angular';
import { VoiceRecorder } from 'capacitor-voice-recorder';
 import { ExpenseFormPage } from '../expense-form/expense-form.page';
import { PublicService } from '../general/public.service';
 @Component({
  selector: 'app-expenses',
  templateUrl: 'expenses.page.html',
  styleUrls: ['expenses.page.scss']
})
export class ExpensesPage implements OnInit{
  expenses:any[] = [];
  categories:any[] = [];
  constructor(
    public publicService:PublicService,
    public sanitizer: DomSanitizer,
    public alertMessage:AlertController,
    public moduleControler:ModalController
  ) {}
   ngOnInit(): void {
    this.getAllExpenses();
    this.getAllCategories();
   }

   getAllExpenses(){
    this.publicService.getMethod('Expenses').subscribe((response:any)=>{
        if (response.success) {
        this.expenses = response.data;        
      }else{
        this.publicService.showErrorAlert("حدث خطاء", response.message)
      }
    }, (error:HttpErrorResponse)=>{
       this.publicService.showErrorAlert("حدث خطاء", error.message)
    })
   }


  async addNewExpense() {
    let addExpense = this.moduleControler.create({
      component: ExpenseFormPage,
      cssClass: 'overlay-width',
      componentProps: {categories:this.categories}
    });
    (await addExpense).onDidDismiss().then(async (data) => {
      if (data.data)  this.ngOnInit();
    });
    (await addExpense).present();
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

  async  confirmDeleteMessage(category: any) {
    var alert = await this.alertMessage.create({
       header: "تأكيد",
       message: "هل انت متاكد من انك تريد اتمام عمليه الحذف",
       buttons: [
         {
           text: "موافق",
           handler: () => {
             this.deleteExpense(category);
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

   deleteExpense(expense: any) {
     this.publicService.deleteMethod(`Expenses/${expense.id}`).subscribe(async (response: any) => {
        if (response.success) {
         this.expenses = await this.expenses.filter(c => c.id !== expense.id);
         this.publicService.showSussessToast(response.message);
       } else {
         this.publicService.showErrorAlert("حدث خطاء", response.message)
       }
     }, (error: HttpErrorResponse) => {
       this.publicService.showErrorAlert("حدث خطاء", error.message)
     })
   }

  async updateExpense(expense:any){
    let addExpense = this.moduleControler.create({
      component: ExpenseFormPage,
      cssClass: 'overlay-width',
      componentProps: { expense: expense,categories:this.categories }
    });
    (await addExpense).onDidDismiss().then(async (data) => {
      if (data.data)  this.ngOnInit();
    });
    (await addExpense).present();
   }
}
