import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-home-view',
    templateUrl: './home-view.component.html',
    styleUrls: ['./home-view.component.scss'],
})
export class HomeViewComponent {
    @HostBinding('class')
    class = 'view';
}
