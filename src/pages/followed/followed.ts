import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, LoadingController, MenuController, Platform } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { DetailPage } from '../detail/detail';

/**
 * Generated class for the FollowedPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-followed',
  templateUrl: 'followed.html',
  providers: [ApiProvider]
})
export class FollowedPage {

  users: any[] = [];
  laoder;

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider, public events: Events, public loadingCtrl: LoadingController, public menu: MenuController, public platform: Platform) {

    events.subscribe('reloadUsers', () => {
      this.retrieveFollowed();
    })

    this.retrieveFollowed();

    events.subscribe('unFollow', ()=>{      
      this.retrieveFollowed();
    })
  }

  ionViewDidLeave(){
    this.events.unsubscribe('reloadUsers');
    this.events.unsubscribe('unFollow');
  }
  retrieveFollowed(){
    
    this.laoder = this.loadingCtrl.create({
      content: "Caricamento degli utenti"
    });
    this.laoder.present();

  	let id = JSON.parse(localStorage.getItem('user'))['id'];
    this.api.retrieveFollowed(id).map(res => res.json())
    .subscribe(data => {
      this.laoder.dismiss();
      this.users = data
    })
  }

  menuToggle()
  {
    this.menu.toggle();
  }

  viewDetails(user){
    this.navCtrl.push(DetailPage, {user: user})
  }

  ionViewDidEnter()
  {
    this.platform.registerBackButtonAction(()=>{
      this.navCtrl.pop();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FollowedPage');
  }

}
