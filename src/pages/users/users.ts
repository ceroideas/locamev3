import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, Events, LoadingController } from 'ionic-angular';
// import { LocalNotifications } from '@ionic-native/local-notifications';
import { LoginPage } from '../login/login';
import { DetailPage } from '../detail/detail';
import { SearchPage } from '../search/search';
import { ApiProvider } from '../../providers/api/api';
import { Geolocation } from '@ionic-native/geolocation';

import { ConnectedPipe } from '../../pipes/connected/connected';

import { LocalNotifications } from '@ionic-native/local-notifications';

import { TranslateService } from '@ngx-translate/core';

// declare var apiRTC: any

// declare var $;

declare var H;

declare var moment;

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
  providers: [ApiProvider, LocalNotifications, ConnectedPipe]
})
export class UsersPage {

  public imagen;
  public user: any[] = [];
  public button:number;
  public getPosition;
  lat = 0;
  lng = 0;
  time = 900;
  state;

  // shareState = false;

  public regId: {userId: string, registrationId: string} = {
    userId: "",
    registrationId: ""
  };

  disabledButton:boolean = false;
  plataforma;

  public stringSearch:{data: string, id: number} = {data: null, id: null};

  users: any[] = [];

  minutes;

  interval;

  // imClient;

  // peer;

  // connectedPeers = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider, public platform: Platform,
    public localNotifications: LocalNotifications, public translate: TranslateService, public connected: ConnectedPipe,
    public alertCtrl: AlertController, public events: Events, public loadingCtrl: LoadingController, private geolocation: Geolocation
    // private localNotifications: LocalNotifications
    ) {

    this.sessionReadyHandler = this.sessionReadyHandler.bind(this);

    let id = JSON.parse(localStorage.getItem('user'))['id'];
    this.api.retrieveFollowedFavs(id).map(res => res.json())
    .subscribe(data => {
      this.users = data
    })

    events.unsubscribe('retrieveFollowed');
    events.subscribe('viewDetails',(user,navigation)=>{
      this.viewDetails(user,navigation);
    })
    events.subscribe('retrieveFollowed',()=>{
      let load = this.loadingCtrl.create();
      load.present();
      this.api.retrieveFollowedFavs(id).map(res => res.json())
      .subscribe(data => {
        load.dismiss();
          this.users = data
      },err=>{
        load.dismiss();
      })
    })

    events.subscribe('endRTC',()=>{
      // apiRTC.disconnect();
    })

    events.unsubscribe('deactivate_locame')
    events.subscribe('deactivate_locame',()=>{

      clearInterval(this.interval);

      this.events.publish('clearInterval');
      
      let content = "";

      this.translate.get('DETAILS.inactive').subscribe((res: string) => {
        content = res;
      });

      if (localStorage.getItem('user')) {
        this.disabledButton = true;

        let user = JSON.parse(localStorage.getItem('user'));

        let _load = this.loadingCtrl.create({
          content: content
        });
        _load.present();

        this.api.changeGeoloc(user)
        .map(res => res.json())
        .subscribe(
          data => {
            localStorage.setItem('user',JSON.stringify(data[0]));
            for (let i = 0; i < data[1].length; i++) {
              // this.imClient.sendMessage(data[1][i],"USER_DISCONNECT");
            }
            this.user = JSON.parse(localStorage.getItem('user'));
            this.button = this.user['geoloc'];
            if (this.button == 1) {
              this.user['lat'] = this.lat;
              this.user['lon'] = this.lng;
            }
            this.disabledButton = false;
            _load.dismiss();
          },
          err => {console.log('err',err);_load.dismiss();}
        );
      }
    })

    events.unsubscribe('saveRegistrationId');
    events.subscribe('saveRegistrationId',()=>{
      console.log('saveRegistrationId');
      this.regId.userId = id;
      this.regId.registrationId = localStorage.getItem('oneSignalId');
      this.saveRegistrationId(false);
    })

    this.plataforma = new H.service.Platform({
      'app_id': 'Hqs8Zl2f04SD8EUYpCtJ',
      'app_code': 'aKCfUjYhHqLQjNHDQDcu6Q'
    });

    if (localStorage.getItem('state')) {
      this.state = localStorage.getItem('state');
    }

    // this.localNotifications.on('trigger',function(){
    //   alert('hola');
    //   this.disabledButton = false;
    // });

    if(!localStorage.getItem('user')){
      this.navCtrl.setRoot(LoginPage);
    }else{
      this.user = JSON.parse(localStorage.getItem('user'));
      console.log(this.user);
      this.imagen = this.user['photo'];
      this.button = this.user['geoloc'];
      this.getPosition = this.button;

      // apiRTC.init({
      //   apiKey : "fc603f3a85d9d4ec56a4dbbb6ece0ee8",
      //   apiCCId : id,
      //   onReady : this.sessionReadyHandler
      // });
    }

    events.subscribe('getLocation', ()=>{
      this.getPos();
      // this.events.unsubscribe('getLocation');
    });

    events.subscribe('initGeoloc', (data)=>{
      this.user = JSON.parse(localStorage.getItem('user'));
      this.button = this.user['geoloc'];
      setTimeout(()=>{
        // for (let i = 0; i < data.length; i++) {
          // this.imClient.sendMessage(data[i],"USER_DISCONNECT");
        // }
      },2000)
      // this.events.unsubscribe('initGeoloc');
    });
  }

  sessionReadyHandler(e)
  {
    console.log(e);
    // this.imClient = apiRTC.session.createIMClient();
    // this.imClient.nickname = this.user['name'];

    // apiRTC.addEventListener('connectedUsersListUpdate', (e)=>{
    //   console.log(e);
    // });
    // apiRTC.addEventListener('receiveIMMessage', (e)=>{
    //   // alert(e.detail.message);
    //   if (e.detail.message.indexOf('USER_CONNECT') != -1) {
    //     let msg = e.detail.message.split('-');
    //     $('[data-user="user-'+e.detail.senderId+'"]').find('.profile-image').addClass('connected');
    //     $('[data-user="user-'+e.detail.senderId+'"]').find('small').text(msg[1]);
    //     if (msg[1] == "") {
    //       $('[data-user="user-'+e.detail.senderId+'"]').find('small').css('display','none');
    //       $('[data-user="user-'+e.detail.senderId+'"]').find('ion-card-header').css('padding','21px');
    //     }else{
    //       $('[data-user="user-'+e.detail.senderId+'"]').find('small').css('display','inline-block');
    //       $('[data-user="user-'+e.detail.senderId+'"]').find('ion-card-header').css('padding','8px 21px');
    //     }
    //     $('[data-user="user-'+e.detail.senderId+'"]').find('img').attr('src','assets/img/contenedor-imagen-perfil-online.png');
    //   }else{
    //     $('[data-user="user-'+e.detail.senderId+'"]').find('.profile-image').removeClass('connected');
    //     $('[data-user="user-'+e.detail.senderId+'"]').find('small').text('');
    //     $('[data-user="user-'+e.detail.senderId+'"]').find('small').css('display','none');
    //     $('[data-user="user-'+e.detail.senderId+'"]').find('img').attr('src','assets/img/contenedor-imagen-perfil.png');
    //     $('[data-user="user-'+e.detail.senderId+'"]').find('ion-card-header').css('padding','21px');
    //   }
    // });
  }

  searchUsers()
  {
    this.navCtrl.push(SearchPage,{stringSearch:this.stringSearch});
  }

  _ionViewDidLoad(){
    setTimeout(()=>{
      let content = "";

      this.translate.get('DETAILS.inactive').subscribe((res: string) => {
        content = res;
      });

      console.log('content',content)

      // this.localNotifications.on('trigger').subscribe(()=>{
      //   if (localStorage.getItem('user')) {
      //     this.disabledButton = true;

      //     let user = JSON.parse(localStorage.getItem('user'));

      //     let _load = this.loadingCtrl.create({
      //       content: content
      //     });
      //     _load.present();

      //     this.api.changeGeoloc(user)
      //     .map(res => res.json())
      //     .subscribe(
      //       data => {
      //         localStorage.setItem('user',JSON.stringify(data[0]));
      //         for (let i = 0; i < data[1].length; i++) {
      //           // this.imClient.sendMessage(data[1][i],"USER_DISCONNECT");
      //         }
      //         this.user = JSON.parse(localStorage.getItem('user'));
      //         this.button = this.user['geoloc'];
      //         if (this.button == 1) {
      //           this.user['lat'] = this.lat;
      //           this.user['lon'] = this.lng;
      //         }
      //         this.disabledButton = false;
      //         _load.dismiss();
      //       },
      //       err => {console.log('err',err);_load.dismiss();}
      //     );
      //   }
      // });
    },1000)

    this.getPos();
  }

  getPos(){
      this.user['lat'] = localStorage.getItem('locame_lat');
      this.user['lon'] = localStorage.getItem('locame_lon');
      this.getPosition = 1;
  }

  updateState()
  {
    this.api.updateState(this.user['id'],this.state).map(res=>res.json())
    .subscribe(data => {
      localStorage.setItem('state',data.state);
    })
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

  newGeoloc(){
    let content;
    this.translate.get('REGISTER.update').subscribe((res: string) => {
      content = res;
    });
    let load = this.loadingCtrl.create({
      // content: "Aggiornamento posizione"
      content: content
    });
    load.present();

    this.disabledButton = true;

    this.geolocation.getCurrentPosition({enableHighAccuracy: true,timeout: 60000,maximumAge: 0}).then((resp) => {
      // loader.dismiss();
      console.log(resp);
      localStorage.setItem('locame_lat',resp.coords.latitude.toString());
      localStorage.setItem('locame_lon',resp.coords.longitude.toString());

      this.reverseGeocode(this.plataforma,resp);

      // var marker = new google.maps.Marker({
      // resp: {lat: resp.coords.latitude, lng: resp.coords.longitude}
      // });

      // var geo = new google.maps.Geocoder();

      // geo.geocode({'latLng': marker.getPosition()}, function(results,status) {
      //   localStorage.setItem('address',results[0]['formatted_address']);
      // });
      this.events.publish('getLocation');

      this.api.newGeoloc(this.user)
      .map(res => res.json())
      .subscribe(data => {
        localStorage.setItem('user',JSON.stringify(data[0]));
        this.user = JSON.parse(localStorage.getItem('user'));
        this.disabledButton = false;
        load.dismiss();
      })

    }).catch((err)=>{
      console.log('Error',err);
      localStorage.setItem('locame_lat',"0");
      localStorage.setItem('locame_lon',"0");
      this.disabledButton = false;
      load.dismiss();
    });
  }

  openAlert(i)
  {
    this.time = 900;

    let hmt,h,hs;
    
    this.translate.get('HOME.how_many_time').subscribe((res: string) => {
      hmt = res;
    });
    this.translate.get('HOME.hour').subscribe((res: string) => {
      h = res;
    });
    this.translate.get('HOME.hours').subscribe((res: string) => {
      hs = res;
    });
    // this.alertCtrl.create({title:"Per quanto tempo starai qui?",inputs:[
    this.alertCtrl.create({title:hmt,inputs:[
     /*{
      name: "time",label: "15 secs" ,type: "radio",checked: true,
      handler:()=>{
        this.time = 15;
      }
    },*/{
      name: "time",label: "15 min" ,type: "radio",checked: true,
      handler:()=>{
        this.time = 900;
      }
    },{
      name: "time",label: "30 min" ,type: "radio",checked: false,
      handler:()=>{
        this.time = 1800;
      }
    },{
      name: "time",label: "1 "+h ,type: "radio",checked: false,
      handler:()=>{
        this.time = 3600;
      }
    },{
      name: "time",label: "3 "+hs ,type: "radio",checked: false,
      handler:()=>{
        this.time = 10800;
      }
    }
    ],buttons:[
      {
        text: "OK",
        handler:()=>{
          this.setMessage(i);
        }
      },{
        text:"CANCEL"
      }
    ]}).present();
  }

  setMessage(i)
  {
    let msg,y,exit;
    this.translate.get('HOME.add_message').subscribe((res: string) => {
      msg = res;
    });
    this.translate.get('HOME.yes').subscribe((res: string) => {
      y = res;
    });
    this.translate.get('HOME.exit').subscribe((res: string) => {
      exit = res;
    });
    this.alertCtrl.create({title:msg,buttons:[{
      text:y,
      handler:()=>{
        this.writeMessage(i);
      }
    },{
      text:"No",
      handler:()=>{
        this.state = "";
        // this.shareState = false;
        this.acceptMessage(i);
      }
    },{
      text:exit,
      handler:()=>{
        this.openAlert(i);
      }
    }]}).present();
    // this.changeGeoloc(i);
  }

  writeMessage(i)
  {
    let stt,spl,c,y,exit,cl;
    this.translate.get('HOME.add_state').subscribe((res: string) => {
      stt = res;
    });
    this.translate.get('HOME.confirm').subscribe((res: string) => {
      c = res;
    });
    this.translate.get('HOME.cancel').subscribe((res: string) => {
      cl = res;
    });
    this.translate.get('HOME.state').subscribe((res: string) => {
      spl = res;
    });
    this.translate.get('HOME.yes').subscribe((res: string) => {
      y = res;
    });
    this.translate.get('HOME.exit').subscribe((res: string) => {
      exit = res;
    });
    this.alertCtrl.create({title:stt,inputs:[{
      name:"state",
      type:"text",
      placeholder:spl
    }],buttons:[{
      text:c,
      handler:(e)=>{
        this.state = e.state;
        // this.shareState = true;
        this.acceptMessage(i);
      }
    },{
      text:cl,
      handler:()=>{
        this.setMessage(i);
      }
    }]}).present();
  }

  acceptMessage(i)
  {
    let lcm,y,exit;
    this.translate.get('HOME.locame_now').subscribe((res: string) => {
      lcm = res;
    });
    this.translate.get('HOME.yes').subscribe((res: string) => {
      y = res;
    });
    this.translate.get('HOME.exit').subscribe((res: string) => {
      exit = res;
    });
    this.alertCtrl.create({title:lcm,buttons:[{
      text:y,
      handler:()=>{
        this.changeGeoloc(i);
      }
    },{
      text:"No",
      handler:()=>{
        this.openAlert(i);
      }
    },{
      text:exit,
      handler:()=>{
        this.state = "";
        // this.shareState = false;
        this.setMessage(i);
      }
    }]}).present();
  }

  changeGeoloc(condition) {

    console.log('changeGeoloc')

    this.geolocation.getCurrentPosition({enableHighAccuracy: true,timeout: 60000,maximumAge: 0}).then((resp) => {
      // loader.dismiss();
      console.log(resp);
      localStorage.setItem('locame_lat',resp.coords.latitude.toString());
      localStorage.setItem('locame_lon',resp.coords.longitude.toString());

      this.reverseGeocode(this.plataforma,resp);

      // var marker = new google.maps.Marker({
      // resp: {lat: resp.coords.latitude, lng: resp.coords.longitude}
      // });

      // var geo = new google.maps.Geocoder();

      // geo.geocode({'latLng': marker.getPosition()}, function(results,status) {
      //   localStorage.setItem('address',results[0]['formatted_address']);
      // });

      this.events.publish('getLocation');

      /**/

        let content;

        if (condition == 0) {
          // content = "LOCAME IT IS DEACTIVATED";
          this.translate.get('DETAILS.inactive').subscribe((res: string) => {
            content = res;
          });
        }else{
          this.translate.get('DETAILS.active_1').subscribe((res: string) => {
            content = res;
          });
          content += (this.time/60);
          this.translate.get('DETAILS.active_2').subscribe((res: string) => {
            content += res;
          });
        }

        let load = this.loadingCtrl.create({
          content: content
        });
        load.present();

        this.disabledButton = true;

        this.api.changeGeoloc(this.user)
        .map(res => res.json())
        .subscribe(
          data => {
            localStorage.setItem('user',JSON.stringify(data[0]));
            this.user = JSON.parse(localStorage.getItem('user'));
            this.button = this.user['geoloc'];
            if (this.button == 1) {
              this.user['lat'] = this.lat;
              this.user['lon'] = this.lng;
            }
            this.disabledButton = false;
            load.dismiss();

            if (condition == 1) {

              // for (let i = 0; i < data[1].length; i++) {
                // this.imClient.sendMessage(data[1][i],"USER_CONNECT-"+this.state);
              // }

              this.minutes = (this.time/60);

              this.interval = setInterval(()=>{
                this.minutes--;
              },60000);

              // if (this.shareState) {
                this.updateState();
              // };

              let id = JSON.parse(localStorage.getItem('user'))['id'];

              this.regId.userId = id;
              this.regId.registrationId = localStorage.getItem('oneSignalId');
              this.saveRegistrationId();

              this.translate.get('DETAILS.inactive').subscribe((res: string) => {
                content = res;
              });

              localStorage.setItem('activation',(new Date()).toString());
              localStorage.setItem('time',this.time.toString());

              this.api.sendDesactivationPush(this.user['id'],localStorage.getItem('language')).map(res=>res.json()).subscribe(data=>{
                let ids = [];
                ids.push(JSON.parse(data[0]).id);
                data[1].forEach(v=>{
                  ids.push(JSON.parse(v).id);
                });
                localStorage.setItem('desactivation_id',JSON.stringify(ids));
                console.log('sendDesactivationPush',data);
              })

              this.api.checkUsersNear()
              .subscribe(()=>{
                console.log('complete checkUsersNear');
              })

              if (!this.platform.is('cordova')) {
                return false;
              }

              // this.localNotifications.schedule({
              //   id: 1,
              //   // text: 'LOCAME VIENE DISATTIVATA',
              //   text: content,
              //   trigger: {at: new Date(moment().add(this.time,'seconds'))},
              //   foreground: true
              //   // trigger: {in: this.time, Unit: 'second'}
              //   // at: new Date(moment().add(this.time,'seconds'))
              // });
            }else{
              this.events.publish('clearInterval');
              clearInterval(this.interval);

              for (let i = 0; i < data[1].length; i++) {
                // this.imClient.sendMessage(data[1][i],"USER_DISCONNECT");
              }

              this.api.cancelNotification().map(res=>res.json()).subscribe(data=>{
                console.log('cancelNotification',data);
              });

              let id = JSON.parse(localStorage.getItem('user'))['id'];
              this.regId.userId = id;
              this.regId.registrationId = "0";
              this.saveRegistrationId(false);

              if (!this.platform.is('cordova')) {
                return false;
              }

              // this.localNotifications.cancel(1).then(()=>{});
            }

          },
          err => {load.dismiss(); console.log(err);}
        );

      /**/

    });
  }

  ionViewDidEnter()
  {
    console.log('entered');
    this.platform.registerBackButtonAction(()=>{
      if (JSON.parse(localStorage.getItem('user'))) {

        let user = JSON.parse(localStorage.getItem('user'));
        
        if (user['geoloc']==1) {

          let loading = this.loadingCtrl.create();

          loading.present();
          this.api.changeGeoloc(user).map(res=>res.json()).subscribe(data=>{

            clearInterval(this.interval);

            this.events.publish('clearInterval');

            this.api.cancelNotification().map(res=>res.json()).subscribe(data=>{
              console.log('cancelNotification',data);
            });

            localStorage.setItem('user',JSON.stringify(data[0]));
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
  }

  viewDetails(user,navigation = true){
    this.navCtrl.push(DetailPage, {user: user,navigation:navigation});
  }

  saveRegistrationId(sendNotif = true){

    this.api.saveRegistrationId(this.regId)
    .map(res => res.json())
    .subscribe(
      data => {console.log('ok');
      let id = JSON.parse(localStorage.getItem('user'))['id'];
      let platform;
      if(this.platform.is('ios')){
        platform = 'ios';
      }else{
        platform = 'android'
      }
      console.log(platform);
      if (sendNotif) {
        this.api.sendNotif(id,platform)
        .map(res => res.json())
        .subscribe(
          data => {},
          err => {}
        );
      }
    },
      err => {console.log(err);}
    );
  }

}
