import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationViewComponent } from './location-view/location-view.component';
import { MapModule } from '../component/map/map.module';
import { GalleryViewComponent } from './gallery-view/gallery-view.component';
import { SafeHtmlPipe } from '../utils/safe-html.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { SinglePictureViewComponent } from './single-picture-view/single-picture-view/single-picture-view.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IssueDisplayComponent } from '../component/single-picutre/issue-display/issue-display.component';
import { ExifDisplayComponent } from '../component/single-picutre/exif-display/exif-display.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { SettingsComponent } from '../components/settings/settings.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { HomeViewComponent } from './home-view/home-view.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    declarations: [
        LocationViewComponent,
        GalleryViewComponent,
        SafeHtmlPipe,
        SinglePictureViewComponent,
        IssueDisplayComponent,
        ExifDisplayComponent,
        SettingsComponent,
        HomeViewComponent,
    ],
    imports: [
        CommonModule,
        MapModule,
        MatPaginatorModule,
        RouterModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatSliderModule,
        MatRadioModule,
        MatSelectModule,
        MatTableModule,
        MatDividerModule,
        MatDialogModule,
        MatSlideToggleModule,
        NgxMatDatetimePickerModule,
        NgxMatNativeDateModule,
        MatTooltipModule,
    ],
})
export class ViewModule {}
