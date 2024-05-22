import { environment } from '../../../environments/environment';
import { Component, OnInit, AfterViewInit, OnDestroy, Input } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Geolocation, PositionOptions } from '@capacitor/geolocation';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  watchId?: string;
  @Input() sedeLat?: number;
  @Input() sedeLng?: number;
  @Input() lat?: number;
  @Input() lng?: number;
  backButtonSubscription: Subscription | null = null;

  constructor(private platform: Platform) { 
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
  }

  ngOnInit() {
  }

  async ngAfterViewInit() {
    const options: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 0, 
      timeout: 10000
    };
    const coordinates = await Geolocation.getCurrentPosition(options);
    console.log('Current position:', coordinates);

    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [coordinates.coords.longitude, coordinates.coords.latitude]
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    const marker = new mapboxgl.Marker()
      .setLngLat([coordinates.coords.longitude, coordinates.coords.latitude])
      .addTo(this.map);

    this.watchId = await Geolocation.watchPosition(options, (position, err) => {
      if (!err && position) {
        marker.setLngLat([position.coords.longitude, position.coords.latitude]);
      }
    });

    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(9999, () => {
      if (this.watchId) {
        Geolocation.clearWatch({ id: this.watchId });
      }
    });

    console.log(this.sedeLat)
    console.log(this.sedeLng)
    if (this.sedeLat !== undefined && this.sedeLng !== undefined) {
      new mapboxgl.Marker()
        .setLngLat([this.sedeLng, this.sedeLat])
        .addTo(this.map);
    }
  }

  ngOnDestroy() {
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
    }
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }
}
