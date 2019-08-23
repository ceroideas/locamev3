import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the RecoveryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-recovery',
  templateUrl: 'recovery.html',
  providers: [ApiProvider]
})
export class RecoveryPage {

  public email;
  enter_email = true;
  sended_code = false;
  change_pass = false;

  code
  password
  password_confirmation

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider, public translate: TranslateService, public platform: Platform, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecoveryPage');
  }

  sendRecoveryEmail()
  {
    var content;
    this.translate.get('DETAILS.check_email').subscribe((res: string) => {
      content = res;
    });

  	this.api.sendRecoveryEmail(this.email)
  	.map(res => res.json())
  	.subscribe(
  		data => {
  			this.alertCtrl.create({message:content}).present();
        this.enter_email = false;
        this.sended_code = true;
        // this.navCtrl.pop();
      },
      err => {
        var not_found;
        this.translate.get('DETAILS.not_found').subscribe((res: string) => {
          not_found = res;
        });
        this.alertCtrl.create({message:not_found}).present();
  		}
  	);
  }

  checkCode()
  {
    if (this.code == localStorage.getItem('verificationLocame')) {
      this.sended_code = false;
      this.change_pass = true;
    }else{
      this.alertCtrl.create({message: "Il codice inserito non è corretto!"}).present();
    }
  }

  changePassword()
  {
    this.api.changePassword({email:this.email,password:this.password,password_confirmation:this.password_confirmation}).map(res=>res.json())
    .subscribe(data=>{

      this.alertCtrl.create({message: "Password modificata correttamente!"}).present();
      this.navCtrl.pop();

    },err=>{
      var arr = Object.keys(JSON.parse(err._body)).map(function(k) { return JSON.parse(err._body)[k] });
      this.alertCtrl.create({message: arr[0][0]}).present();
    })
  }

  ionViewDidEnter()
  {
    this.platform.registerBackButtonAction(()=>{
      this.navCtrl.pop();
    });
  }

}
