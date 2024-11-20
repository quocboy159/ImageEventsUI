import { TestBed } from '@angular/core/testing';

import { ImageEventService } from './image-event.service';

describe('ImageEventService', () => {
  let service: ImageEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
