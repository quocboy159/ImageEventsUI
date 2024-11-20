import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ImageEventService } from './image-event.service';
import { ImageEventItem } from '../models/imageEventItem.model';
import { environment } from '../../environments/environment.development';

describe('ImageEventService', () => {
  let service: ImageEventService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ImageEventService]
    });

    service = TestBed.inject(ImageEventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifies that no unmatched requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getImageEvents', () => {
    it('should return an Observable of ImageEventItem array', () => {
      const mockEvents: ImageEventItem[] = [
        {
          imageUrl: 'http://test1.com/image1.jpg',
          description: 'Test Description 1',
          createdDate: new Date()
        },
        {
          imageUrl: 'http://test2.com/image2.jpg',
          description: 'Test Description 2',
          createdDate: new Date()
        }
      ];

      service.getImageEvents().subscribe(events => {
        expect(events).toEqual(mockEvents);
        expect(events.length).toBe(2);
        expect(events[0].imageUrl).toBe('http://test1.com/image1.jpg');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/ImageEvents/latest`);
      expect(req.request.method).toBe('GET');
      req.flush(mockEvents);
    });

    it('should use the correct API endpoint', () => {
      service.getImageEvents().subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/api/ImageEvents/latest`);
      expect(req.request.url).toBe(`${environment.apiUrl}/api/ImageEvents/latest`);
      req.flush([]);
    });

    it('should handle empty response', () => {
      service.getImageEvents().subscribe(events => {
        expect(events).toEqual([]);
        expect(events.length).toBe(0);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/ImageEvents/latest`);
      req.flush([]);
    });

    it('should handle error response', () => {
      const errorMessage = 'Server error';

      service.getImageEvents().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/ImageEvents/latest`);
      req.flush(errorMessage, {
        status: 500,
        statusText: 'Internal Server Error'
      });
    });

    it('should make only one HTTP request', () => {
      service.getImageEvents().subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/api/ImageEvents/latest`);
      req.flush([]);

      // Verify no additional requests were made
      httpMock.verify();
    });
  });
});
