import { AfterViewInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as L from 'leaflet';
import { AerosoulApiService } from '../../services/aerosoul-api.service';
import { MapUtils } from '../../utils/map.utils';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    MatInputModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;
  private markers: L.Circle[] = [];

  public query: string = 'ahmedabad';

  constructor(private snackBar: MatSnackBar, private aerosoulApiService: AerosoulApiService) { }

  ngAfterViewInit() {
    this.map = MapUtils.initMap(20.5937, 78.9629);
    setTimeout(() => {
      this.map.invalidateSize();
      MapUtils.addLegend(this.map);
      // default
      this.searchQuery();

    }, 0);
  }

  searchQuery(): void {
    this.aerosoulApiService.search(this.query, 1).subscribe({
      next: (response) => {
        response.data.forEach((geopoint: any) => this.draw(geopoint));

      },
      error: (error) => {
        console.error('Error fetching air quality data:', error);
        this.showErrorToast('Error fetching air quality data');
      }
    })
  }

  private draw(geoPoint: any) {
    try {
      // Create marker
      const color = this.getAqiColor(geoPoint.aqi);
      const marker = MapUtils.createAirQualityMarker(this.map, geoPoint.lat, geoPoint.lon, color);
      marker.bindTooltip(`
        <h3>${geoPoint.name}</h3>
        <p>AQI: ${geoPoint.aqi}</p>
        <p>Main Pollutant: ${geoPoint.dominentpol}</p>
        <p>Last Updated: ${new Date(geoPoint.time.iso).toLocaleString()}</p>
      `);
      this.markers.push(marker);

      // Get bounds and fit map
      const bounds = MapUtils.getBoundaryBoxBounds(geoPoint.bounding_box);
      if (bounds) {
        this.map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 12
        });
      }
      this.map.setView([geoPoint.lat, geoPoint.lon], 10);
    } catch (error) {
      console.error('Error processing air quality data:', error);
      this.showErrorToast('Error displaying air quality data');
    }
  }

  private getAqiColor(aqi: number): string {
    if (aqi <= 50) return '#00e400';
    if (aqi <= 100) return '#ffff00';
    if (aqi <= 150) return '#ff7e00';
    if (aqi <= 200) return '#ff0000';
    if (aqi <= 300) return '#8f3f97';

    return '#7e0023';
  }

  private showErrorToast(message: string) {
    this.snackBar.open(message, 'Ok', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
