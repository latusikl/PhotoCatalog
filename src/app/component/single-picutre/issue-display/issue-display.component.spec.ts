import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueDisplayComponent } from './issue-display.component';

describe('IssueDisplayComponent', () => {
  let component: IssueDisplayComponent;
  let fixture: ComponentFixture<IssueDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
