import { NavParams } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PublicService } from '../general/public.service';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.scss'],
})
export class ImageViewComponent implements OnInit {
  
  //#region Declration
  expense: any;
  //#endregion

  //#region Constractor
  constructor(
    public sanitizer: DomSanitizer,
    public navParams: NavParams,
    public publicService: PublicService
  ) {

  }
  //#endregion

  //#region Angular Life Cycle
  async ngOnInit() {
    let expense = await this.navParams.get("expense");
    if (expense) this.expense = expense;;
  }
  //#region 

}
