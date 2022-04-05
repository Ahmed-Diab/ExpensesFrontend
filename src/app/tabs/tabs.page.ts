import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  tabs: any[] = [
    { name: "home", icon: "home"},
    { name: "Expenses", icon: "wallet"},
    { name: "category", icon: "grid" }
   
  ]

  constructor(
    private router: Router
  ) { }

  logout() {
    this.router.navigate(['/signin']);
    localStorage.clear();
  }
}
