import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { Facebook } from '@ionic-native/facebook';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule, Http } from '@angular/http';

import { Geolocation } from '@ionic-native/geolocation';
// import { LocalNotifications } from '@ionic-native/local-notifications';

import { InAppBrowser } from '@ionic-native/in-app-browser';

import { MyApp } from './app.component';
import { ConfigPageModule } from '../pages/config/config.module';
import { DetailPageModule } from '../pages/detail/detail.module';
import { LoginPageModule } from '../pages/login/login.module';
import { LogoutPageModule } from '../pages/logout/logout.module';
import { MapPageModule } from '../pages/map/map.module';
import { RegisterPageModule } from '../pages/register/register.module';
import { SearchPageModule } from '../pages/search/search.module';
import { UsersPageModule } from '../pages/users/users.module';
import { RecoveryPageModule } from '../pages/recovery/recovery.module';
import { FollowedPageModule } from '../pages/followed/followed.module';
import { LocationPageModule } from '../pages/location/location.module';

import { DisclaimerPageModule } from '../pages/disclaimer/disclaimer.module';
import { PipesModule } from '../pipes/pipes.module';

import { enableProdMode } from '@angular/core';

import { Camera } from '@ionic-native/camera';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

enableProdMode();
@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: ''
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient, Http]
      }
    }),
    HttpModule,
    HttpClientModule,
    LoginPageModule,
    RegisterPageModule,
    UsersPageModule,
    LogoutPageModule,
    MapPageModule,
    SearchPageModule,
    DetailPageModule,
    ConfigPageModule,
    RecoveryPageModule,
    DisclaimerPageModule,
    FollowedPageModule,
    LocationPageModule,
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    InAppBrowser,
    // LocalNotifications,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    Facebook
  ]
})
export class AppModule {}
