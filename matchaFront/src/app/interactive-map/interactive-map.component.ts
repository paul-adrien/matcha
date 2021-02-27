import { Component, ElementRef, ViewChild, AfterViewInit, Input, OnInit, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../libs/user';
import { map } from 'rxjs/operators';

declare var google: any;

@Component({
  selector: 'app-interactive-map',
  template: `
  <div class="col" id="cadre">
    <div #mapContainer id="map"></div>
    <div id="mapError"></div>
  </div>
  <p *ngIf="users && users[0]">{{users[0].lastName}}</p>
  `,
  styleUrls: ['./interactive-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InteractiveMapComponent implements OnChanges, AfterViewInit {
  @Input() users: User[];
  @Input() me: User;

  @ViewChild('mapContainer', {static: false}) gmap: ElementRef;

  constructor(private router: Router) {}

  map: google.maps.Map;
  lat = 47.128439;
  lng = 2.779515;
  zoom = false;
  //infowindow = new google.maps.InfoWindow({});
  markers = [];
  coordinates = new google.maps.LatLng(this.lat, this.lng);

  mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    zoom: 5.5
  };


  ngAfterViewInit() {
    this.mapInitializer();
  }

  ngOnChanges() {
    let color = "red";
    if (this.me) {
      if (this.me.gender == 1)
        color = "red";
      else (this.me.gender == 2)
       color = "blue";
      let newCenter = new google.maps.LatLng(parseFloat(this.me.latitude), parseFloat(this.me.longitude));
      this.map.setCenter(newCenter);
      let marker = new google.maps.Marker({
        position: { lat: parseFloat(this.me.latitude), lng: parseFloat(this.me.longitude) },
        map: this.map,
        title: "Moi"
      });
      marker.setMap(this.map);
      marker.addListener("click", () => {
        let infoWindow = new google.maps.InfoWindow({
          content: marker.getTitle()
        });
        infoWindow.open(marker.getMap(), marker);
      });
    }
    this.pushCarres();
  }

  mapInitializer() {
    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
  }

  pushCarres() {
    this.removeMarkers();

    if (this.users) {
      for(var i=0; i< this.users.length;i++) {
        let userColor = "http://labs.google.com/ridefinder/images/mm_20_black.png";
        if (this.users[i].gender == 1)
          userColor = "http://labs.google.com/ridefinder/images/mm_20_blue.png";
        else if (this.users[i].gender == 2)
          userColor = "http://labs.google.com/ridefinder/images/mm_20_purple.png";

        let marker = new google.maps.Marker({
          position: { lat: parseFloat(this.users[i].latitude), lng: parseFloat(this.users[i].longitude) },
          icon: {
            url: userColor
          },
          map: this.map,
          title: "<a href='home/profile-view/"+this.users[i].id+"'>"+this.users[i].lastName+" "+this.users[i].firstName+"</a>"
        });
        marker.addListener("click", () => {
          let infoWindow = new google.maps.InfoWindow({
            content: marker.getTitle()
          });
          infoWindow.open(marker.getMap(), marker);
        });
        marker.setMap(this.map);
        this.markers.push(marker);
      }
    }
  }

  profile(id) {
    this.router.navigate(["home/profile-view/1"]);
  }

  removeMarkers() {
    if (this.markers){
      this.markers.map(function (marker) {
        if (marker.getMap() != null)
          marker.setMap(null);
      })
    }
  }

  toggleRepartiteursMarkes() {
  }

}
