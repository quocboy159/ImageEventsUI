import { Component, OnDestroy, OnInit } from '@angular/core';
import { ImageEventService } from '../../services/image-event.service';
import { ImageEventItem } from '../../models/imageEventItem.model';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { interval, startWith, Subscription, switchMap } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-image-event-list',
  standalone: true,
  imports: [MatTableModule, MatProgressSpinnerModule, DatePipe],
  templateUrl: './image-event-list.component.html',
  styleUrl: './image-event-list.component.css',
})
export class ImageEventListComponent implements OnInit, OnDestroy {
  private subscription?: Subscription;
  imageEvents: ImageEventItem[] = [];
  displayedColumns: string[] = ['imageUrl', 'description', 'createdDate'];
  isLoading: boolean = false;

  constructor(private imageEventService: ImageEventService) {}

  ngOnInit(): void {
    this.subscription = interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => {
          this.isLoading = true;
          return this.imageEventService.getImageEvents();
        })
      )
      .subscribe({
        next: (data) => {
          this.imageEvents = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching events:', error);
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
