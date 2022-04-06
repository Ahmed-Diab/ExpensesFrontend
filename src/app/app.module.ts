import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { Interceptor } from './general/interceptor';
import { RouteReuseStrategy } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AppRoutingModule } from './app-routing.module';
import { PublicService } from './general/public.service';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    NgxChartsModule,
    SharedModule,
    BrowserAnimationsModule
  ],
  providers: [
    PublicService,
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
