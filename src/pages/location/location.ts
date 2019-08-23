import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the LocationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
 declare var google;

@IonicPage()
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})
export class LocationPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  loader;
  lat: string;
  lon: string;
  geoloc;

  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation, public loadingCtrl: LoadingController, private iab: InAppBrowser, public platform: Platform) {
  	this.lat = navParams.get('lat');
  	this.lon = navParams.get('lon');
    this.geoloc = navParams.get('geoloc');
    console.log(this.lat,this.lon,this.geoloc);
    this.loader = this.loadingCtrl.create({
      content: "Caricamento della Mappa"
    });
    this.loader.present();
  	this.loadMap();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationPage');
  }

  openIAB(url){
    let lat = localStorage.getItem('locame_lat');
    let lon = localStorage.getItem('locame_lon');
    this.iab.create(url+this.lat+','+this.lon+'/'+lat+','+lon+'/data=!4m2!4m1!3e2?hl=it-419');
  }

  loadMap(){
 
    this.geolocation.getCurrentPosition({enableHighAccuracy: true,timeout: 60000,maximumAge: 0}).then((position) => {

      this.loader.dismiss();
 
      let latLng = new google.maps.LatLng(this.lat,this.lon);
 
      let mapOptions = {
        center: latLng,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false,
        styles: [
          {
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#212121"
              }
            ]
          },
          {
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "on"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#212121"
              }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "administrative.country",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "stylers": [
              {
                "visibility": "on"
              }
            ]
          },
          {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#bdbdbd"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#181818"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#1b1b1b"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#2c2c2c"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#8a8a8a"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#373737"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#3c3c3c"
              }
            ]
          },
          {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#4e4e4e"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "featureType": "transit",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#000000"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#3d3d3d"
              }
            ]
          }
        ]
      }
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        // let request = {
        //   location: latLng,
        //   radius: '1000000',
        //   types: ['store','shopping_mall','cafe','movie_theater','hospital']
        // };

        // let service = new google.maps.places.PlacesService(this.map);
        // service.nearbySearch(request, (results, status) => {
        //   console.log(results)
        //   if (status == google.maps.places.PlacesServiceStatus.OK) {
        //     for (let i = 0; i < results.length; i++) {
        //       let place = results[i];
        //       let marker1 = new google.maps.Marker({
        //         map: this.map,
        //         position: place.geometry.location
        //       });
        //       let infoWindow1 = new google.maps.InfoWindow({
        //         content: place.name
        //       });
        //       google.maps.event.addListener(marker1, 'click', () => {
        //         infoWindow1.open(this.map, marker1);
        //       });
        //     }
        //   }
        // });

        let user = JSON.parse(localStorage.getItem('user'));

        let imagen = user['geoloc'] == 1 ? "assets/img/contenedor-imagen-perfil-online.png" : "assets/img/contenedor-imagen-perfil.png";

        let marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          icon: { url : imagen, scaledSize: new google.maps.Size(34, 48) },
          position: new google.maps.LatLng(localStorage.getItem('locame_lat'), localStorage.getItem('locame_lon'))
        });

        let infoWindow = new google.maps.InfoWindow({
          content: JSON.parse(localStorage.getItem('user'))['name']+': '+localStorage.getItem('address')
        });
       
        google.maps.event.addListener(marker, 'click', () => {
          infoWindow.open(this.map, marker);
        });

        /***/

        imagen = this.geoloc == 1 ? "assets/img/contenedor-imagen-perfil-online.png" : "assets/img/contenedor-imagen-perfil.png";

        let marker1 = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          icon: { url : imagen, scaledSize: new google.maps.Size(34, 48) },
          position: this.map.getCenter()
        });
       
        let geo = new google.maps.Geocoder();
        geo.geocode({'latLng': marker1.getPosition()}, function(results,status) {

          let infoWindow = new google.maps.InfoWindow({
            content: results[0]['formatted_address']
          });
         
          google.maps.event.addListener(marker1, 'click', () => {
            infoWindow.open(this.map, marker1);
          });
        });
      }, (err) => {
        console.log(err);
      });
  }

  ionViewDidEnter()
  {
    this.platform.registerBackButtonAction(()=>{
      this.navCtrl.pop();
    });
  }

  getDirection()
  {
    let directionsDisplay = new google.maps.DirectionsRenderer({
      map: this.map,
      suppressMarkers: true
    });

    let request1 = {
      destination: {lat: this.lat, lng: this.lon},
      origin: {lat: parseFloat(localStorage.getItem('locame_lat')), lng: parseFloat(localStorage.getItem('locame_lon'))},
      travelMode: 'DRIVING'
    };

    let directionsService = new google.maps.DirectionsService();
    directionsService.route(request1, function(response, status) {
      if (status == 'OK') {
        directionsDisplay.setDirections(response);
      }
    });
  }

}
