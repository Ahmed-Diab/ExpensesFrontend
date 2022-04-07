import { Subscription } from 'rxjs';
import { Color } from '@swimlane/ngx-charts';
import { HttpErrorResponse } from '@angular/common/http';
import { PublicService } from '../general/public.service';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

  //#region Declration
  @ViewChild("containerRef") containerRef: ElementRef
  single: any[] = [];
  view: [number, number] = [400, 320];
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = false;
  isDoughnut: boolean = false;
  legendPosition: any = 'below';
  dashboardSubscription: Subscription;
  colorScheme: Color = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
    name: 'colorScheme',
    selectable: false,
    group: null
  };
  //#endregion

  //#region Constractor
  constructor(
    private publicService: PublicService
  ) {
  }
  //#endregion

  //#region Ionic Life Cycle

  async ionViewDidEnter() {
    await  this.resizeChart(this.containerRef.nativeElement.offsetWidth)
    await  this.getDashbordData();
  }

  ionViewDidLeave() {
    this.dashboardSubscription.unsubscribe();
  }

  //#endregion

  //#region Methods
  async getDashbordData() {
    await this.publicService.loading();
    this.dashboardSubscription = this.publicService.getMethod('Users/GetDashboard').subscribe(async (response: any) => {
      if (response.success) {
        this.single = response.data;
      } else {
        this.publicService.showErrorAlert("Error", response.message)
      }
      await this.publicService.killLoading();
    }, async (error: HttpErrorResponse) => {
      await this.publicService.killLoading();
      this.publicService.showErrorAlert("Error", error.message)
    })
  }

  resizeChart(width: any): void {
    this.view = [width, 320]
  }

  // onSelect(data): void {
  //   console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  // }

  // onActivate(data): void {
  //   console.log('Activate', JSON.parse(JSON.stringify(data)));
  // }

  // onDeactivate(data): void {
  //   console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  // }
  //#endregion

}
