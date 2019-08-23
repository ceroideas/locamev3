import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';
import 'rxjs/add/operator/map';

declare var moment;

@Injectable()
export class ApiProvider {
  url;
  constructor(private http: Http) {
    // this.url = 'http://localhost/api_test/public';
    this.url = 'http://www.locame.it/public';
  }

  updateState(id,state){
    let headers = new Headers();
    headers.append('enctype', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });

    let user = this.http.post(this.url+'/api/updateState',{id: id, state: state},options);
    return user;
  }

  regUser(userData){
    let headers = new Headers();
    headers.append('enctype', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });

    let user = this.http.post(this.url+'/api/register',userData,options);
    return user;
  }

  editUser(userData){
    let headers = new Headers();
    headers.append('enctype', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });

    let user = this.http.post(this.url+'/api/update',userData,options);
    return user;
  }

  loginUser(userData){
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });

    let user = this.http.post(this.url+'/api/login',userData,options);
    return user;
  }

  changeGeoloc(geolocData){
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });

    geolocData.address = localStorage.getItem('address');

    let user = this.http.post(this.url+'/api/geoloc',geolocData,options);
    return user;
  }

  newGeoloc(geolocData){
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });

    geolocData.address = localStorage.getItem('address');

    let user = this.http.post(this.url+'/api/newGeoloc',geolocData,options);
    return user;
  }

  listUsers(stringSearch){
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });

    let list = this.http.post(this.url+'/api/list',stringSearch,options);
    return list;
  }

  followUnfollow(Ids){
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });

    let follow = this.http.post(this.url+'/api/follow',Ids,options);
    return follow;
  }

  getUserStatus(Ids){
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });

    let follow = this.http.post(this.url+'/api/getUserStatus',Ids,options);
    return follow;
  }

  getLocations(Id){
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });

    let locations = this.http.post(this.url+'/api/getLocations',Id,options);
    return locations;
  }

  saveRegistrationId(regId){
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });

    let reg = this.http.post(this.url+'/api/registerDevice',regId,options);
    return reg;
  }

  sendNotif(userId,platform){
    let user = this.http.get(this.url+'/api/sendNotif/'+userId+'/'+platform);
    return user;
  }

  cancelNotif(userId){
    let user = this.http.get(this.url+'/api/cancelNotif/'+userId);
    return user;
  }

  sendRecoveryEmail(email){
    
    function makeid() {
      var text = "";
      var possible = "0123456789";

      for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    }

    localStorage.setItem('verificationLocame', makeid());

    let user = this.http.get(this.url+'/api/sendRecoveryEmail/'+email+'/'+localStorage.getItem('verificationLocame'));
    return user;
  }

  changePassword(data){
    let user = this.http.post(this.url+'/api/changePassword',data);
    return user;
  }

  retrieveFollowed(id){
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });

    let users = this.http.post(this.url+'/api/retrieveFollowed',{id: id},options);
    return users;
  }

  retrieveFollowedFavs(id){
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });

    let users = this.http.post(this.url+'/api/retrieveFollowedFavs',{id: id},options);
    return users;
  }

  addFavorite(Ids){
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });

    let users = this.http.post(this.url+'/api/addFavorite',Ids,options);
    return users;
  }

  pay(id){
    return this.http.get(this.url+'/api/pay/'+id);
  }

  sendDesactivationPush(id,lang)
  {
    // console.log('sendDesactivationPush');
    let delay = new Date(moment(localStorage.getItem('activation')).add(parseInt(localStorage.getItem('time'))-30,'second'));
    let notif = new Date(moment(localStorage.getItem('activation')).add(parseInt(localStorage.getItem('time')),'second'));
    let start = new Date(moment(localStorage.getItem('activation')));
    return this.http.post(this.url+'/api/sendDesactivationPush',{id:id,lang:lang,start:start,delay:delay,notif:notif});
  }

  checkUsersNear()
  {
    let user_id = JSON.parse(localStorage.getItem('user'))['id'];
    let time = new Date();
    return this.http.post(this.url+'/api/checkUsersNear',{user_id:user_id,time:time});
  }

  loadUniqueUser(id)
  {
    return this.http.get(this.url+'/api/loadUniqueUser/'+id);
  }

  removeToken(id)
  {
    return this.http.post(this.url+'/api/removeToken',{id:id});
  }

  cancelNotification()
  {
    // console.log('cancelNotification');
    let ids = JSON.parse(localStorage.getItem('desactivation_id'));
    let user_id = JSON.parse(localStorage.getItem('user'))['id'];
    return this.http.post(this.url+'/api/cancelNotification',{ids:ids,user_id:user_id});
  }

}
