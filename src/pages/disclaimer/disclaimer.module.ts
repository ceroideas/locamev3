import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DisclaimerPage } from './disclaimer';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule, Http } from '@angular/http';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    DisclaimerPage,
  ],
  imports: [
    IonicPageModule.forChild(DisclaimerPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient, Http]
      }
    }),
    HttpModule,
    HttpClientModule,
  ],
})
export class DisclaimerPageModule {}
