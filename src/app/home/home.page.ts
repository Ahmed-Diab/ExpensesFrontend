import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { PublicService } from '../general/public.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild("containerRef") containerRef: ElementRef
  single: any[] = [];
  view: any[] = [400, 320];
  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = false;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';
  dashboardSubscription: Subscription
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(
    private publicService: PublicService
  ) {
  }
  ngOnInit(): void {

  }
  ionViewDidEnter() {
    this.resizeChart(this.containerRef.nativeElement.offsetWidth)
    this.getDashbordData();
  }
  async getDashbordData() {
    await this.publicService.loading();
    this.dashboardSubscription = this.publicService.getMethod('Users/GetDashboard').subscribe(async (response: any) => {
      if (response.success) {
        this.single = response.data;
      } else {
        this.publicService.showErrorAlert("حدث خطاء", response.message)
      }
      await this.publicService.killLoading();
    }, async (error: HttpErrorResponse) => {
      await this.publicService.killLoading();
      this.publicService.showErrorAlert("حدث خطاء", error.message)
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

}
