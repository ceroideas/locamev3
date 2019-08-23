import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ApiProvider } from '../../providers/api/api';

import { LocalNotifications } from '@ionic-native/local-notifications';

/**
 * Generated class for the LogoutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
  providers: [ApiProvider, LocalNotifications]
})
export class LogoutPage {
	user;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider, private localNotifications: LocalNotifications, public events: Events) {
    this.events.publish('deactivate_locame');
    this.localNotifications.cancel(1).then(()=>{});
  	this.user = JSON.parse(localStorage.getItem('user'));
    this.api.cancelNotif(this.user['id']).map(res=>res.json()).subscribe(data=>{
      console.log(data)
    });
    this.api.removeToken(this.user['id']).map(res=>res.json()).subscribe(data=>{
      console.log('erased');
    })
  	if (this.user['geoloc']==1) {
  		this.api.changeGeoloc(this.user).map(res=>res.json()).subscribe(data=>{
  			console.log(data.geoloc)
  		});
  	}
    localStorage.removeItem('user');
  	localStorage.removeItem('state');
    this.events.publish('endRTC');
  	this.navCtrl.setRoot(LoginPage);
  }

}
