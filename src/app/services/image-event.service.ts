import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageEventItem } from '../models/imageEventItem.model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ImageEventService {
  constructor(private htpClient: HttpClient) {}

  getImageEvents: () => Observable<ImageEventItem[]> = () => {
    return this.htpClient.get<ImageEventItem[]>(`${environment.apiUrl}/api/ImageEvents/latest`);
  };
}
