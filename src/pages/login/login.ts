import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, Platform, Events } from 'ionic-angular';
import { UsersPage } from '../users/users';
import { RegisterPage } from '../register/register';
import { RecoveryPage } from '../recovery/recovery';
import { ApiProvider } from '../../providers/api/api';

import { TranslateService } from '@ngx-translate/core';

// import { Push, PushOptions, PushObject } from '@ionic-native/push';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [ApiProvider
  // , Push
  ]
})
export class LoginPage {

  public data: {email: string, password: string} = {
    email: "",
    password: ""
  };

  remember;

  translation: any[] = [];

  disabledButton:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public menu: MenuController, 
    public alertCtrl: AlertController, public api: ApiProvider, 
    // private push: Push, 
    public translateService: TranslateService, public platform: Platform, public events: Events) {

    if (localStorage.getItem('remember-locame')) {
      this.data['email'] = localStorage.getItem('remember-locame');
    }

    this.menu.swipeEnable(false);
  }

  ionViewDidLoad() {
    // this.translateService.get('ALERTS.complete_fields').subscribe((res: string) => {
    //   this.translation['complete_fields'] = localStorage.getItemres;
    // });
    // this.translateService.get('ALERTS.wrong_data').subscribe((res: string) => {
    //   this.translation['wrong_data'] = res;
    // });
  }

  goToRegister(){
  	this.navCtrl.push(RegisterPage)
  }

  goToRecovery(){
    this.navCtrl.push(RecoveryPage) 
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Error',
      message: this.translation['wrong_data'],
      buttons: ['OK']
    });
    alert.present();
  }

  loginUser(){
    
    this.translation['complete_fields'] = localStorage.getItem('complete_fields');
    this.translation['wrong_data'] = localStorage.getItem('wrong_data');

    this.disabledButton = true;
    if (this.data.email == "" || this.data.password == "") {
      
      let r422 = this.alertCtrl.create({
        title: 'Error',
        message: this.translation['complete_fields'],
        buttons: ['OK']
      });
      r422.present();
      this.disabledButton = false;

    }else{
      this.api.loginUser(this.data)
      .map(res => res.json())
      .subscribe(
        data => {

          if (this.remember) {
            localStorage.setItem('remember-locame',this.data['email'])
          }else{
            localStorage.removeItem('remember-locame');
          }

          localStorage.setItem('user', JSON.stringify(data));
          if (data['state'] != null) {
            localStorage.setItem('state', data['state']);
          }
          this.events.publish('locameLogin');
          this.navCtrl.setRoot(UsersPage);
          setTimeout(()=>{
            this.events.publish('saveRegistrationId');
          },2000)
        },
        err => {
          console.log(err.json());
          this.disabledButton = false;
          this.showAlert()
        });
    }
  }

}
