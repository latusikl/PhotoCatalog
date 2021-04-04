import { Component, Input, OnInit } from '@angular/core';
import { ImageDataFacade } from '../../../model/ImageDataFacade';
import { EditableImageDataProperty } from '../../../model/EditableImageDataProperty';

@Component({
    selector: 'app-exif-display',
    templateUrl: './exif-display.component.html',
    styleUrls: ['./exif-display.component.scss'],
})
export class ExifDisplayComponent implements OnInit {
    @Input()
    imageDataFacade: ImageDataFacade | undefined;

    displayedColumns: string[] = ['name', 'value', 'unit'];

    ngOnInit(): void {
        console.log(this.imageDataFacade);
    }

    isExifData(): boolean {
        return !!this.imageDataFacade?.imageDataValues;
    }

    getDataSource(): EditableImageDataProperty<string | number | Date | null>[] {
        return !!this.imageDataFacade?.imageDataValues ? this.imageDataFacade?.imageDataValues : [];
    }
}
