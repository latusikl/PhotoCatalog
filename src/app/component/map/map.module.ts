import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { MapComponent } from './map.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [MapComponent],
    imports: [CommonModule, GoogleMapsModule, HttpClientModule, HttpClientJsonpModule, MatButtonModule],
    exports: [MapComponent],
})
export class MapModule {}
