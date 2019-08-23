import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, MenuController, Platform } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { UsersPage } from '../users/users';
import { Camera } from '@ionic-native/camera';

import { TranslateService } from '@ngx-translate/core';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
  providers: [ApiProvider, FileTransfer]
})
export class ConfigPage {

  public user: any;
  public imagen: string;
  public formData: FormData = new FormData();

  translation:any[] = [];

  constructor(private transfer: FileTransfer, public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider, public alert: AlertController, public camera: Camera, public translate: TranslateService, public loadingCtrl: LoadingController, public menu: MenuController, public platform: Platform) {
  	this.user = JSON.parse(localStorage.getItem('user'));
    this.formData.append('id', this.user.id);
    this.formData.append('photo', this.user.photo);
  	this.imagen = this.user['photo'];

    translate.get('ALERTS.user_updated').subscribe((res: string) => {
      this.translation['user_updated'] = res;
    });
    translate.get('ALERTS.check_data').subscribe((res: string) => {
      this.translation['check_data'] = res;
    });
    translate.get('ALERTS.error').subscribe((res: string) => {
      this.translation['error'] = res;
    });
  }

  showAlert(msg) {
    let alert = this.alert.create({
      title: 'Error',
      message: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  successAlert() {
    let alert = this.alert.create({
      title: 'Success',
      message: this.translation['user_updated'],
      buttons: ['OK']
    });
    alert.present();
  }

  getPicture(){
    this.camera.getPicture({
     sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
     destinationType: this.camera.DestinationType.NATIVE_URI
    }).then((imageData) => {
      this.uploadImage(imageData);
     }, (err) => {
      console.log(err);
      alert(JSON.stringify(err));
    });
  }

  uploadImage(path) {
    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
       fileKey: 'file',
       fileName: 'ionicFile.jpg',
       chunkedMode: false,
       headers:{Connection: 'close'}
    }

    let load = this.loadingCtrl.create();
    load.present();

    fileTransfer.upload(path, 'http://www.locame.it/public/api/uploadImage', options)
     .then((data) => {

       if (JSON.parse(data['response'])[0] == 'noimg') {
         return alert("No image file selected");
       }

       this.imagen = JSON.parse(data['response'])[0];

       this.formData.append('photo', JSON.parse(data['response'])[0]);

       load.dismiss();

       console.log(data);
     }, (err) => {
       load.dismiss();
       alert(err);
     })
  }

  editUser(){
  	this.formData.append('name', this.user.name);
  	this.formData.append('email', this.user.email);
  	this.formData.append('password', this.user.password);
  	console.log(this.formData);
  	this.api.editUser(this.formData)
  	.map(res => res.json())
  	.subscribe(
  		data => {
  			this.successAlert();
  			localStorage.setItem('user', JSON.stringify(data));
  			this.navCtrl.setRoot(UsersPage);
  		},
  		err => {
        console.log(err._body);
        if (err.status == 422) {
          this.showAlert(this.translation['check_data']);
        }else{
          this.showAlert(this.translation['error']);
        }
  		}
  	);
  }

  ionViewDidEnter()
  {
    this.platform.registerBackButtonAction(()=>{
      this.navCtrl.pop();
    });
  }

  menuToggle()
  {
    this.menu.toggle();
  }

  ionViewDidLoad() {
  }

}
