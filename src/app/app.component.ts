import { Component } from '@angular/core';
import { MapComponent } from './components/map/map.component';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [MapComponent],
  template: `<app-map></app-map>`
})
export class AppComponent {
  title = 'Aerosoul';
}
