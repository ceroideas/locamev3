import { Component, ViewChild, enableProdMode } from '@angular/core';
import { Nav, Platform, AlertController, Events, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { UsersPage } from '../pages/users/users';
import { LogoutPage } from '../pages/logout/logout';
import { MapPage } from '../pages/map/map';
import { SearchPage } from '../pages/search/search';
import { ConfigPage } from '../pages/config/config';
import { DisclaimerPage } from '../pages/disclaimer/disclaimer';
import { FollowedPage } from '../pages/followed/followed';
import { Geolocation } from '@ionic-native/geolocation';

import { ApiProvider } from '../providers/api/api';

import { OneSignal } from '@ionic-native/onesignal';

import { Deeplinks } from '@ionic-native/deeplinks';

import { Subscription } from 'rxjs';

// import firebase from 'firebase';

// import { Push, PushOptions, PushObject } from '@ionic-native/push';

import { Network } from '@ionic-native/network';

import { TranslateService } from '@ngx-translate/core';

import { BackgroundMode } from '@ionic-native/background-mode';

// declare var google

declare var H;

declare var moment;

enableProdMode();

@Component({
  templateUrl: 'app.html',
  providers: [Network, ApiProvider, OneSignal, Deeplinks, BackgroundMode
  // , Push
  ]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = LoginPage;

  translation:any[] = [];
  plataforma;

  interval;

  private onResumeSubscription: Subscription;

  ngOnDestroy() {
    // always unsubscribe your subscriptions to prevent leaks
    clearInterval(this.interval);
    this.onResumeSubscription.unsubscribe();
  }

  testUser()
  {
    this.api.loadUniqueUser(2).map(res=>res.json())
    .subscribe(data=>{
      this.events.publish('viewDetails',data,false);
    })
  }

  constructor(public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,  private geolocation: Geolocation, public events: Events, public loadingCtrl: LoadingController,
    // private push: Push, 
    private backgroundMode: BackgroundMode,
    private toast: ToastController,
    private deeplinks: Deeplinks,
    private oneSignal: OneSignal,
    public alertCtrl: AlertController, private network: Network, public translate: TranslateService, public api: ApiProvider) {

    this.deepLink();

    platform.ready().then(() => {
      statusBar.styleDefault();
      statusBar.show();
      splashScreen.hide();

      this.events.subscribe('clearInterval',()=>{
        clearInterval(this.interval);
      });

      this.onResumeSubscription = this.platform.resume.subscribe(() => {
         console.log('APP RESUMED');
         this.events.publish('retrieveFollowed');
         if (document.querySelector('#time-active')) {
           let activation = localStorage.getItem('activation');
           let time = parseInt(localStorage.getItem('time'))/60;
           let mom = moment(activation).add(time,'minute');
           let diff = mom.diff(moment(),'second');
           let diff_m = mom.diff(moment(),'minute');

           // alert(diff+' '+mom+' '+time+' '+activation);

           if (diff >= 30) {
             document.querySelector('#time-active').innerHTML = (diff_m+1).toString();

             if (true) {
               
               clearInterval(this.interval); // limpiar este intervalo xd clm quitalo jorge 

               this.interval = setInterval(()=>{
                 diff = mom.diff(moment(),'second');
                 diff_m = mom.diff(moment(),'minute');
                 if (diff >= 30) {
                   document.querySelector('#time-active').innerHTML = (diff_m+1).toString();
                 }else{
                   document.querySelector('#time-active').innerHTML = "0";
                   // this.api.cancelNotification();
                   // this.events.publish('deactivate_locame');
                   clearInterval(this.interval);
                 }
               },5000)
             }
           }else{
             clearInterval(this.interval);
             document.querySelector('#time-active').innerHTML = "0";
             this.api.cancelNotification();
             this.events.publish('deactivate_locame');
           }
         }
      });

      this.plataforma = new H.service.Platform({
        'app_id': 'Hqs8Zl2f04SD8EUYpCtJ',
        'app_code': 'aKCfUjYhHqLQjNHDQDcu6Q'
      });

      if (localStorage.getItem('user')) {
        let user = JSON.parse(localStorage.getItem('user'));
        if (user['geoloc']==1) {
          
          // let content;

          // translate.get('DETAILS.wait').subscribe((res: string) => {
          //   content = res;
          // });

          let loader = this.loadingCtrl.create(/*{
            content: content
          }*/);
          loader.present();
          this.api.changeGeoloc(user).map(res=>res.json()).subscribe(data=>{
            localStorage.setItem('user',JSON.stringify(data[0]));
            events.publish('initGeoloc',data[1]);
            loader.dismiss();
          });
        }
      }

      translate.setDefaultLang('it');

      var ln = window.navigator.language||navigator.language;

      if (ln.indexOf('en') != -1) {
        ln = 'en';
      }

      localStorage.setItem('language',ln);

      this.translate.use(ln);

      // translate.get('ALERTS.no_internet').subscribe((res: string) => {
      //   this.translation['no_internet'] = res;
      // });

      this.network.onDisconnect().subscribe(() => {
        // alert(this.translation['no_internet']);
      });

      setTimeout(()=>{
        this.translate.get('ALERTS.complete_fields').subscribe((res: string) => {
          localStorage.setItem('complete_fields',res);
        });
        this.translate.get('ALERTS.wrong_data').subscribe((res: string) => {
          localStorage.setItem('wrong_data',res);
        });
      },1000)

      // this.initPushNotification();
      this.handlerNotifications();


    });

    this.platform.registerBackButtonAction(()=>{
      if (JSON.parse(localStorage.getItem('user'))) {

        let user = JSON.parse(localStorage.getItem('user'));
        
        if (user['geoloc']==1) {
          
          let content;
        
          translate.get('DETAILS.disable_geoloc').subscribe((res: string) => {
            content = res;
          });

          let loading = this.loadingCtrl.create({
            content: content
          });

          loading.present();
          this.api.changeGeoloc(user).map(res=>res.json()).subscribe(data=>{
            localStorage.setItem('user',JSON.stringify(data));
            console.log(data.geoloc);
            loading.dismiss();
            this.platform.exitApp();
          });
        }else{
          this.platform.exitApp();
        }
      }else{
        this.platform.exitApp();
      }
    });

    /**/

    if (localStorage.getItem('user')) {
      if (localStorage.getItem('disclaimer-locame')) {
        this.rootPage = UsersPage; 
        this.getLocation();
      }else{
        this.rootPage = DisclaimerPage;
      }
    }else{
      if (localStorage.getItem('disclaimer-locame')) {
        this.rootPage = LoginPage;
      }else{
        this.rootPage = DisclaimerPage;
      }
    }

    events.subscribe('locameLogin',()=>{
      this.getLocation();
    });
  }

  reverseGeocode(platform,resp) {
    var geocoder = platform.getGeocodingService(),
      reverseGeocodingParameters = {
        prox: resp.coords.latitude.toString()+','+resp.coords.longitude.toString(),
        mode: 'retrieveAll',
        locationattributes:'address,streetDetails,additionalData',
        maxresults: '1',
        jsonattributes : 1
      };;

    geocoder.reverseGeocode(
      reverseGeocodingParameters,
      (result) => {
        var locations = result.response.view[0].result;
        console.log('locations',locations);
        let loc = locations[0]['location']['address'];
        localStorage.setItem('address',
          (typeof loc['postalCode'] !== 'undefined' ? loc['postalCode']+' - ' : '')+
          // (typeof loc['country'] !== 'undefined' ? loc['country']+' - ' : '')+
          (typeof loc['label'] !== 'undefined' ? loc['label'] : ''));
        localStorage.setItem('country',(typeof loc['label'] !== 'undefined' ? loc['label'].split(',').pop() : ''));
      },
      (error) => {
        alert('Ooops!');
      }
    );
  }

  getLocation()
  {
    // var loader = this.loadingCtrl.create({
    //   content: "Ottenere Posizione"
    // });
    // loader.present();

    this.geolocation.getCurrentPosition({enableHighAccuracy: true,timeout: 60000,maximumAge: 0}).then((resp) => {
      // loader.dismiss();
      console.log(resp);
      localStorage.setItem('locame_lat',resp.coords.latitude.toString());
      localStorage.setItem('locame_lon',resp.coords.longitude.toString());

      this.reverseGeocode(this.plataforma,resp);

      // var geo = new google.maps.Geocoder();

      // geo.geocode({'latLng': {lat: resp.coords.latitude, lng: resp.coords.longitude}}, (results,status)=> {
      //   console.log('Geocoder',results,status)
      //   localStorage.setItem('address',results[0]['formatted_address']);
      // });

      console.log('all ok')
      this.events.publish('getLocation');
    }).catch((err)=>{
      console.log('Error');
      localStorage.setItem('locame_lat',"0");
      localStorage.setItem('locame_lon',"0");
      // loader.dismiss();
    });
  }

  private handlerNotifications(){
    if (!this.platform.is('cordova')) {
      return false;
    }
    this.oneSignal.startInit('830c4a85-aa8b-471f-be28-1fb51bd6dbce', '469222604467');
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    this.oneSignal.handleNotificationReceived()
    .subscribe(() => {
      // this.toast.create({message: "Utente conesso/disconesso",duration: 100}).present();
      this.events.publish('retrieveFollowed');
      this.events.publish('reloadUsers');

      // clearInterval(this.interval);

      if (document.querySelector('#time-active')) {
       let activation = localStorage.getItem('activation');
       let time = parseInt(localStorage.getItem('time'))/60;
       let mom = moment(activation).add(time,'minute');
       let diff = mom.diff(moment(),'second');
       let diff_m = mom.diff(moment(),'minute');

       if (diff >= 30) {
         document.querySelector('#time-active').innerHTML = (diff_m+1).toString();
       }else{
         document.querySelector('#time-active').innerHTML = "0";
         this.api.cancelNotification();
         this.events.publish('deactivate_locame');
         clearInterval(this.interval);
       }
      }
      // setTimeout(()=>{
      //   this.toast.create({message: "Ricaricare i preferiti!",duration: 2000}).present();
      // },500)
    });
    this.oneSignal.handleNotificationOpened()
    .subscribe(jsonData => {

      let data = jsonData.notification.payload.additionalData;
      if (data.type) {
        this.api.loadUniqueUser(data.id).map(res=>res.json())
        .subscribe(data=>{
          this.events.publish('viewDetails',data,false);
        })
      }else{
        let alert = this.alertCtrl.create({
          title: 'Locame: Nuova notifica!',
          subTitle: jsonData.notification.payload.body,
          buttons: ['Accettare']
        });
        alert.present();
      }

      console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    });
    this.oneSignal.endInit();

    this.oneSignal.getIds().then((ids)=> {localStorage.setItem('oneSignalId',ids.userId);
      if (localStorage.getItem('user')) {
        this.events.publish('saveRegistrationId');
      }
     // alert(ids.userId)
   });
  }

  pushPage(page) {    
    let component = this.nav.getViews().find(x => x.component.name == page);
    if (component) {
      alert(component.index);
      this.nav.remove(component.index);
    }

    if (page == 'FollowedPage') {this.nav.push(FollowedPage);}
    if (page == 'MapPage') {this.nav.push(MapPage);}
    if (page == 'SearchPage') {this.nav.push(SearchPage);}
    if (page == 'ConfigPage') {this.nav.push(ConfigPage);}
  }

  private deepLink()
  {
    if (!this.platform.is('cordova')) {
      return false;
    }
    this.deeplinks.routeWithNavController(this.nav,{
     '/': LoginPage,
   }).subscribe(match => {
     // match.$route - the route we matched, which is the matched entry from the arguments to route()
     // match.$args - the args passed in the link
     // match.$link - the full link data
     console.log('Successfully matched route', match);
   }, nomatch => {
     // nomatch.$link - the full link data
     console.error('Got a deeplink that didn\'t match', nomatch);
   });
  }

  openPage(page) {
    if (page == 'UsersPage') {this.nav.setRoot(UsersPage);}
    // if (page == 'FollowedPage') {this.nav.setRoot(FollowedPage);}
    // if (page == 'MapPage') {this.nav.setRoot(MapPage);}
    // if (page == 'SearchPage') {this.nav.setRoot(SearchPage);}
    // if (page == 'ConfigPage') {this.nav.setRoot(ConfigPage);}
    if (page == 'LogoutPage') {this.nav.setRoot(LogoutPage);}
  }
}

