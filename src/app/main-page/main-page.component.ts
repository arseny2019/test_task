import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { DateRange, MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { PostService } from '../post.service';
import { Event } from '../app.model';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: [ './main-page.component.scss' ]
})
export class MainPageComponent implements AfterViewInit {
  @ViewChild('calendar') calendar?: ElementRef;

  events: Event[] = [];
  selectedDate: DateRange<Date> | Date | null = null;
  activeDayClass = 'busy-day';
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const date = cellDate.getDate();
      let busy = false;
      if (this.postService.db) {
        this.postService.db.dates?.forEach(eventDay => {
          if (new Date(JSON.parse(eventDay.date)).getTime() === cellDate.getTime()) {
            busy = true;
            return;
          }
        });
        return busy ? this.activeDayClass : '';
      }
    }
    return '';
  };

  constructor(private router: Router, private postService: PostService) {
  }

  navigate() {
    this.router.navigate([ 'edit', JSON.stringify(this.selectedDate) ]);
  }

  updateEvents() {
    this.events = this.postService.getEventsByDate(this.selectedDate as Date);
  }

  ngAfterViewInit(): void {
    this.postService.db$.subscribe(() => {
      this.updateEvents();
      if (this.postService.getEventsByDate(this.selectedDate as Date).length === 0) {
        (this.calendar?.nativeElement as HTMLElement)?.querySelectorAll('.' + this.activeDayClass).forEach(
          elem => {
            if ((elem.querySelector('.mat-focus-indicator') as HTMLElement).innerHTML.trim() === (this.selectedDate as Date)?.getDate().toString()) {
              elem.classList.remove(this.activeDayClass);
            }
          }
        );
      }
    })
  }
}
