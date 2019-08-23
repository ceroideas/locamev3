import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController, Platform } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api'
import { LocationPage } from '../location/location'
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';

/**
 * Generated class for the DetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
  providers: [ApiProvider, PayPal]
})
export class DetailPage {

  public user;
  public actual;
  public imagen;
  public button = null;
  public ids: {user_id: number, follow_id: number} = {
  	user_id: null,
  	follow_id: null
  };

  disabledButton:boolean = false;
  favorite = null;
  show_star = null;
  navigation = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider, public events: Events, public alertCtrl: AlertController, private payPal: PayPal, public platform: Platform) {
  	this.user = navParams.get('user');
  	this.actual = JSON.parse(localStorage.getItem('user'));
  	this.ids.user_id = this.actual['id'];
  	this.ids.follow_id = this.user['id'];

    this.navigation = this.navParams.get('navigation');
    console.log(this.navigation, !this.navigation)

  	console.log(this.ids)
  	this.imagen = this.user['photo'];
  	this.getUserStatus();
  }

  getUserStatus(){
  	this.api.getUserStatus(this.ids)
  	.map(res => res.json())
  	.subscribe(
  		data => {
        this.button = data[0];
  			this.user = data[1];
        this.favorite = data[2];
        this.show_star = true;
  		},
  		err => console.log(err)
  	);
  }

  addFavorite()
  {
    this.api.addFavorite(this.ids)
    .map(res=>res.json())
    .subscribe(data=>{
      this.favorite = data[0];
      this.events.publish('retrieveFollowed');
    },err=>{
      let alert = this.alertCtrl.create({
        message: JSON.parse(err._body)[0]
      })
      alert.present();
    })
  }

  followUnfollow(){
    this.disabledButton = true;
  	this.api.followUnfollow(this.ids)
  	.map(res => res.json())
  	.subscribe(
  		data => {
  			this.button = data;
        this.disabledButton = false;
        this.events.publish('unFollow');
        this.events.publish('retrieveFollowed');
        this.events.publish('reloadUsers');
  		},
  		err => {

        this.disabledButton = false;
        let alert = this.alertCtrl.create({
          message: JSON.parse(err._body)[0]
        })
        alert.addButton({
          text: "Pagare",
          handler: ()=> {
            console.log("PayPal");
            this.pay();
          }
        })

        alert.addButton({
          text: "Annullare",
          handler: ()=> {
            console.log("Annullare");
          }
        })

        alert.present();
      }
  	);

  }

  pay()
  {
    console.log('paypal')
    this.payPal.init({
      PayPalEnvironmentProduction: 'Ab8GtwA3uhuYuwJXAtaBl7axJ2GwXjhNIGK61d12dfrg0U31MVDGgMCQUS4_mirrvobT5eP3z7-mSvwk',
      PayPalEnvironmentSandbox: ''
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentProduction', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        // payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let payment = new PayPalPayment("1.99", 'EUR', 'Locame App', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then((response) => {
          // Successfully paid

          this.api.pay(this.ids.user_id)
          .subscribe(()=>console.log("payed"));

          this.alertCtrl.create({message:"Payment successful!",buttons: [{text:"Ok", handler: ()=>{
            this.api.followUnfollow(this.ids)
            .map(res => res.json())
            .subscribe(
              data => {
                this.button = data;
                this.disabledButton = false;
                this.events.publish('unFollow');
              },
              err => {}
            );
          }}]}).present();

        }, (err) => {
          // Error or render dialog closed without being successful
          this.alertCtrl.create({message:"Error or render dialog closed without being successful"+JSON.stringify(err)}).present();
        });
      }, () => {
        // Error in configuration
        this.alertCtrl.create({message:"Error in configuration"}).present();
      });
    }, () => {
    // Error in initialization, maybe PayPal isn't supported or something else
    this.alertCtrl.create({message:"Error in initialization, maybe PayPal isn't supported or cordova is not available"}).present();
   });
  }

  getPosition(lat,lon)
  {
    this.navCtrl.push(LocationPage, {lat:lat,lon:lon,geoloc:this.user['geoloc']});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

  ionViewDidEnter()
  {
    this.platform.registerBackButtonAction(()=>{
      this.navCtrl.pop();
    });
  }

}
