import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {WebcamModule} from 'ngx-webcam';
import { CameraPage } from './register/camera.page';

import {FilterListPage} from './register/filter-list.page';

//import { AutoCompleteModule } from 'ionic4-auto-complete';

@NgModule({
  declarations: [AppComponent, CameraPage, FilterListPage], 
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,WebcamModule,HttpClientModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
