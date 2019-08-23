import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { UsersPage } from '../users/users';

/**
 * Generated class for the DisclaimerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-disclaimer',
  templateUrl: 'disclaimer.html',
})
export class DisclaimerPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DisclaimerPage');
  }

  acceptDisclaimer()
  {
  	localStorage.setItem('disclaimer-locame','1');

  	if (localStorage.getItem('user')) {
  		this.navCtrl.setRoot(UsersPage);
  		this.events.publish('locameLogin');
  	}else{
  		this.navCtrl.setRoot(LoginPage);
  	}
  }

}
