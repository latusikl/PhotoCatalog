import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
    selector: 'google-maps-demo',
    templateUrl: './google-maps-demo.component.html',
})
export class MapComponent {
    apiLoaded: Observable<boolean>;

    constructor(httpClient: HttpClient) {
        this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=YOUR_KEY_HERE', 'callback').pipe(
            map(() => true),
            catchError(() => of(false)),
        );
    }
}
