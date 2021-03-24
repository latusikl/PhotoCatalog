import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePictureViewComponent } from './single-picture-view.component';

describe('SinglePictureViewComponent', () => {
  let component: SinglePictureViewComponent;
  let fixture: ComponentFixture<SinglePictureViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SinglePictureViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SinglePictureViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
