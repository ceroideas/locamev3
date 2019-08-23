import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Camera } from '@ionic-native/camera';
import { Facebook } from '@ionic-native/facebook';

import { TranslateService } from '@ngx-translate/core';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers: [ApiProvider, Facebook, FileTransfer]
})
export class RegisterPage {

	public user:{name: string, email: string, password: string}={
		name: "",
		email: "",
		password: ""
	};

  public userProfile: any = null;

	public imagen: any = 'assets/img/default.png';

	public formData: FormData = new FormData();

  translation: any[] = [];

  disabledButton:boolean = false;

  constructor(private transfer: FileTransfer, public fb: Facebook, public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider, public alert: AlertController, private camera: Camera, public translate: TranslateService, public loadingCtrl: LoadingController, public platform: Platform) {
    translate.get('ALERTS.check_data').subscribe((res: string) => {
      this.translation['check_data'] = res;
    });
    translate.get('ALERTS.user_registered').subscribe((res: string) => {
      this.translation['user_registered'] = res;
    });
    translate.get('REGISTER.success').subscribe((res: string) => {
      this.translation['success'] = res;
    });
  }

  ionViewDidLoad() {
  }

  showAlert(msg) {
    let alert = this.alert.create({
      title: 'Error',
      message: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  loginWithFacebook(){

    var content;
    this.translate.get('DETAILS.loading').subscribe((res: string) => {
      content = res;
    });
    let loader = this.loadingCtrl.create({
      content: content
    });
    loader.present();
    this.fb.login(['public_profile', 'email'])
    .then(res => {
      console.log(res.status);
      if(res.status === 'connected'){
        this.getInfo(res.authResponse.userID);
        loader.dismiss();
      };
    })
    .catch(error =>{
      console.error( error );
      loader.dismiss();
      alert(JSON.stringify(error));
    });
  }

  getInfo(userid){
    this.fb.api("/"+userid+"/?fields=id,email,name,picture,gender",['public_profile','email'])
    .then(res=>{
      console.log(res);
          this.userProfile = res;
          this.user.name = this.userProfile.name;
          this.user.email = this.userProfile.email;
          this.imagen = "https://graph.facebook.com/"+userid+"/picture?type=large";
          this.formData.append('photo', this.imagen);
    })
    .catch(error =>{
      console.error( error );
      alert(JSON.stringify(error));
    });
  }

  successAlert() {
    let alert = this.alert.create({
      title: this.translation['success'],
      message: this.translation['user_registered'],
      buttons: ['OK']
    });
    alert.present();
  }

  fileLoad(event){
  	let fileList: FileList = event.target.files;
  	if(fileList.length > 0) {
        let file: File = fileList[0];
        this.formData.append('photo', file, file.name);
	    let myReader:FileReader = new FileReader();
	    myReader.onloadend = (e) => {
	    	this.imagen = myReader.result;
	    }
	    myReader.readAsDataURL(file);
    }
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

  ionViewDidEnter()
  {
    this.platform.registerBackButtonAction(()=>{
      this.navCtrl.pop();
    });
  }

  regUser(){
    this.disabledButton = true;
  	this.formData.append('name', this.user.name);
  	this.formData.append('email', this.user.email);
  	this.formData.append('password', this.user.password);
  	console.log(this.formData);
  	this.api.regUser(this.formData)
  	.map(res => res.json)
  	.subscribe(
  		data => {
  			this.successAlert();
  			this.navCtrl.pop();
  			console.log(data);
  		},
  		err => {
        console.log(err._body);
        this.disabledButton = false;
        if (err.status == 422) {
          this.showAlert(this.translation['check_data']);
        }else{
          this.showAlert('Error');
        }
  		}
  	);
  }

}
