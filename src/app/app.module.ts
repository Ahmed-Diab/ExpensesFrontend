import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
 import { Interceptor } from './general/interceptor';
import { PublicService } from './general/public.service';
 @NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    NgxChartsModule, 
    BrowserAnimationsModule
  ],
  providers: [
    PublicService,
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, 
    ],
  bootstrap: [AppComponent],
})
export class AppModule {}
