import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
    selector: 'map',
    templateUrl: './map.component.html',
})
export class MapComponent {
    apiLoaded: Observable<boolean>;

    @Input()
    options: google.maps.MapOptions;

    constructor(httpClient: HttpClient) {
        this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js', 'callback').pipe(
            map(() => true),
            catchError(() => of(false)),
        );
        this.options = {};
    }
}
