import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageEventListComponent } from './image-event-list.component';

describe('ImageEventListComponent', () => {
  let component: ImageEventListComponent;
  let fixture: ComponentFixture<ImageEventListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageEventListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
