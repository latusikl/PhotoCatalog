import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ElectronService } from 'ngx-electron';
import { ImageService } from 'src/app/service/image.service';
import { GalleryViewComponent } from './gallery-view.component';
import { ImageData } from 'src/app/model/ImageData';
import { SortField } from 'src/app/model/SortField';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('GalleryViewComponent', () => {
    let component: GalleryViewComponent;
    let fixture: ComponentFixture<GalleryViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [ElectronService],
            declarations: [GalleryViewComponent],
            imports: [
                RouterTestingModule,
                ReactiveFormsModule,
                MatSelectModule,
                MatOptionModule,
                MatInputModule,
                MatCheckboxModule,
                MatButtonModule,
                MatIconModule,
                MatRadioModule,
                MatDatepickerModule,
                MatNativeDateModule,
                ReactiveFormsModule,
                MatCheckboxModule,
                MatSliderModule,
                BrowserAnimationsModule,
                MatPaginatorModule,
                MatTooltipModule,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GalleryViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have images', () => {
        const imgService = TestBed.inject(ImageService);
        const imgArr = [new ImageData('name1', 'path1'), new ImageData('name2', 'path2')];
        imgService.imagesData.next(imgArr);
        expect(component.imagesData).toEqual(imgArr);
    });

    it('should filter by name', () => {
        const notFilteredImg = new ImageData('not_filte_red', 'path2');
        const filteredImg = new ImageData('filtered', 'path1');
        const imgArr = [filteredImg, notFilteredImg];
        component.criteriaForm.controls.name.setValue(notFilteredImg.name);
        const filtered = component.filterImages(imgArr);
        expect(filtered).toContain(notFilteredImg);
        expect(filtered).not.toContain(filteredImg);
    });

    it('should sort ascending by name', () => {
        const first = new ImageData('first', 'path2');
        const second = new ImageData('second', 'path1');
        const third = new ImageData('third', 'path3');
        const imgArr = [third, first, second];
        component.sortField = <SortField>{ name: 'name', field: 'name' };
        component.sortAsc = true;
        const sorted = component.sortImages(imgArr);
        expect(sorted[0]).toEqual(first);
        expect(sorted[1]).toEqual(second);
        expect(sorted[2]).toEqual(third);
    });

    it('should sort descending by name', () => {
        const first = new ImageData('first', 'path2');
        const second = new ImageData('second', 'path1');
        const third = new ImageData('third', 'path3');
        const imgArr = [third, first, second];
        component.sortField = <SortField>{ name: 'name', field: 'name' };
        component.sortAsc = false;
        const sorted = component.sortImages(imgArr);
        expect(sorted[0]).toEqual(third);
        expect(sorted[1]).toEqual(second);
        expect(sorted[2]).toEqual(first);
    });

    it('should get third page', () => {
        const imgArr: ImageData[] = [];
        for (const i of Array(123).keys()) {
            imgArr.push(new ImageData('name' + i, 'path' + i));
        }
        component.pageSize = 50;
        component.currentPage = 2;
        component.getImagesPage(imgArr);
        const page = component.imagesData;
        expect(page.length).toEqual(23);
        expect(page[0].name).toEqual('name100');
    });

    it('should get first page', () => {
        const imgArr: ImageData[] = [];
        for (const i of Array(123).keys()) {
            imgArr.push(new ImageData('name' + i, 'path' + i));
        }
        component.pageSize = 50;
        component.currentPage = 0;
        component.getImagesPage(imgArr);
        const page = component.imagesData;
        expect(page.length).toEqual(50);
        expect(page[0].name).toEqual('name0');
    });
});
