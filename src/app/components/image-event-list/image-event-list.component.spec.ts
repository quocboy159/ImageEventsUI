import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ImageEventListComponent } from './image-event-list.component';
import { ImageEventService } from '../../services/image-event.service';
import { ImageEventItem } from '../../models/imageEventItem.model';
import { of, throwError } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';

describe('ImageEventListComponent', () => {
  let component: ImageEventListComponent;
  let fixture: ComponentFixture<ImageEventListComponent>;
  let imageEventService: jasmine.SpyObj<ImageEventService>;
  
  const mockImageEvents: ImageEventItem[] = [
    {
      imageUrl: 'test-url-1',
      description: 'Test Description 1',
      createdDate: new Date()
    },
    {
      imageUrl: 'test-url-2',
      description: 'Test Description 2',
      createdDate: new Date()
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ImageEventService', ['getImageEvents']);
    
    await TestBed.configureTestingModule({
      imports: [
        ImageEventListComponent,
        MatTableModule,
        DatePipe
      ],
      providers: [
        { provide: ImageEventService, useValue: spy }
      ]
    }).compileComponents();

    imageEventService = TestBed.inject(ImageEventService) as jasmine.SpyObj<ImageEventService>;
    fixture = TestBed.createComponent(ImageEventListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty image events array', () => {
    expect(component.imageEvents).toEqual([]);
  });

  it('should have correct displayed columns', () => {
    expect(component.displayedColumns).toEqual(['imageUrl', 'description', 'createdDate']);
  });

  it('should load image events on init', fakeAsync(() => {
    imageEventService.getImageEvents.and.returnValue(of(mockImageEvents));
    
    fixture.detectChanges();
    
    expect(component.isLoading).toBeTrue();
    
    tick();
    
    expect(component.imageEvents).toEqual(mockImageEvents);
    expect(component.isLoading).toBeFalse();
    expect(imageEventService.getImageEvents).toHaveBeenCalled();
  }));

  it('should handle error when loading image events', fakeAsync(() => {
    const errorMessage = 'Test error';
    imageEventService.getImageEvents.and.returnValue(throwError(() => new Error(errorMessage)));
    spyOn(console, 'error');
    
    fixture.detectChanges();
    
    expect(component.isLoading).toBeTrue();
    
    tick();
    
    expect(component.isLoading).toBeFalse();
    expect(console.error).toHaveBeenCalledWith('Error fetching events:', jasmine.any(Error));
    expect(component.imageEvents).toEqual([]);
  }));

  it('should poll for new events every 5 seconds', fakeAsync(() => {
    imageEventService.getImageEvents.and.returnValue(of(mockImageEvents));
    
    fixture.detectChanges();
    tick();
    
    expect(imageEventService.getImageEvents).toHaveBeenCalledTimes(1);
    
    tick(5000);
    expect(imageEventService.getImageEvents).toHaveBeenCalledTimes(2);
    
    tick(5000);
    expect(imageEventService.getImageEvents).toHaveBeenCalledTimes(3);
  }));

  it('should unsubscribe on destroy', fakeAsync(() => {
    imageEventService.getImageEvents.and.returnValue(of(mockImageEvents));
    
    fixture.detectChanges();
    tick();
    
    const unsubscribeSpy = spyOn(component['subscription']!, 'unsubscribe');
    
    component.ngOnDestroy();
    
    expect(unsubscribeSpy).toHaveBeenCalled();
  }));
});
