import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, LoadingController, MenuController, Platform } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

/**
 * Generated class for the MapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var google;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  providers: [ApiProvider]
})
export class MapPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  places: any;

  public user;
  public locations: any[] = [];
  loader;

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider, public events: Events, public loadingCtrl: LoadingController, public menu: MenuController, public platform: Platform) {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.loader = this.loadingCtrl.create({
      content: "Caricamento della Mappa"
    });
    this.loader.present();
    this.getLocations();
  }

  getLocations(){
    this.api.getLocations(this.user)
    .map(res => res.json())
    .subscribe(
      data => {this.locations = data, this.loadMap()},
      err => console.log(err)
    );
  }

  addInfoWindow(marker, content){
 
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
   
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  menuToggle()
  {
    this.menu.toggle();
  }

  loadMap(){

    this.loader.dismiss();
 
    let latLng = new google.maps.LatLng(localStorage.getItem('locame_lat'), localStorage.getItem('locame_lon'));

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

    // var request = {
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

    let imagen = this.user['geoloc'] == 1 ? "assets/img/contenedor-imagen-perfil-online.png" : "assets/img/contenedor-imagen-perfil.png";

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      icon: { url : imagen, scaledSize: new google.maps.Size(34, 48) },
      position: this.map.getCenter()
    });

    console.log(marker);
   
    let content = JSON.parse(localStorage.getItem('user'))['name'];
   
    this.addInfoWindow(marker, content);

    for (var i = 0; i < this.locations.length; i++) {

      let imagen = this.locations[i].followed.geoloc == 1 ? "assets/img/contenedor-imagen-perfil-online.png" : "assets/img/contenedor-imagen-perfil.png";

      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        icon: { url : imagen, scaledSize: new google.maps.Size(34, 48) },
        position: new google.maps.LatLng(this.locations[i].followed.lat, this.locations[i].followed.lon)
      });

      console.log(marker.getPosition());

      let infoWindow = new google.maps.InfoWindow({
        content: this.locations[i].followed.name+': '+this.locations[i].followed.address
      });
     
      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(this.map, marker);
      });
    }
  }

  ionViewDidEnter()
  {
    this.platform.registerBackButtonAction(()=>{
      this.navCtrl.pop();
    });
  }
}
