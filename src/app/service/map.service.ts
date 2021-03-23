import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class MapService {
    apiLoaded: Observable<boolean>;

    constructor(httpClient: HttpClient) {
        this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js', 'callback').pipe(
            map(() => true),
            catchError(() => of(false)),
        );
    }
}
