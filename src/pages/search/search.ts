import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, MenuController, Platform } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { DetailPage } from '../detail/detail';

import { TranslateService } from '@ngx-translate/core';
/**
 * Generated class for the SearchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  providers: [ApiProvider]
})
export class SearchPage {

  public users:any[]=[];
  public user:any[]=[];
  public stringSearch:{data: string, id: number} = {data: null, id: null};

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider, public loadingCtrl: LoadingController, public translate: TranslateService, public menu: MenuController, public platform: Platform) {
    this.stringSearch = this.navParams.get('stringSearch');
  	this.user = JSON.parse(localStorage.getItem('user'));
    this.stringSearch.id = this.user['id'];
    this.searchUsers();
  }

  searchUsers(){

    var content;

    this.translate.get('DETAILS.loading').subscribe((res: string) => {
      content = res;
    });

    var loading = this.loadingCtrl.create({
      content: content
    });
    loading.present();
    this.api.listUsers(this.stringSearch)
    .map(res => res.json())
    .subscribe(
      data => {
        this.users = data;
        loading.dismiss();
      },
      err => console.log(err)
    );
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
  }

}
