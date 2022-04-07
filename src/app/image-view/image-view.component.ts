import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavParams } from '@ionic/angular';
import { PublicService } from '../general/public.service';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.scss'],
})
export class ImageViewComponent implements OnInit {
  expense: any;
  constructor(
    public sanitizer: DomSanitizer,
    public navParams: NavParams,
    public publicService: PublicService
  ) {

  }

  async ngOnInit() {
    let expense = await this.navParams.get("expense");
    if (expense) this.expense = expense;;

  }

}
