import { Injectable } from '@angular/core';
import { DataBase, EventDay, Event } from './app.model';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

@Injectable()
export class PostService {
  db: DataBase = {} as DataBase;
  db$: BehaviorSubject<DataBase> = new BehaviorSubject<DataBase>({} as DataBase);

  constructor(private router: Router) {
    this.db$.subscribe(db => this.db = db);
    this.refreshDatabase();
  }

  refreshDatabase(): void {
    this.db$.next(JSON.parse(localStorage.getItem('database') as string));
  }

  updateEvent(newValue: Event, oldValue: Event): any {
    this.db.dates.forEach(eventDay => {
      if (eventDay.date === oldValue.date) {
        eventDay.events.forEach(event => {
          if (event.id === oldValue.id) {
            let date = this.db.dates[this.db.dates.indexOf(eventDay)];
            date.events.splice(date.events.indexOf(event), 1, newValue);
          }
        })
      }
    });
    localStorage.setItem('database', JSON.stringify(this.db));
    this.refreshDatabase();
    console.log('Запись успешно обновлена');
    this.router.navigate([ '/' ]);
  }

  addNewEvent(event: Event): void {
    let dataBase: DataBase = this.db ? this.db : { dates: [] };
    let currentDay = dataBase.dates.filter(eventDay => eventDay.date === event.date);
    if (currentDay && currentDay.length > 0) {
      const index = dataBase.dates.indexOf(currentDay[0]);
      currentDay[0].events.push(event);
      dataBase.dates[index] = currentDay[0];
    } else {
      dataBase.dates.push({ date: event.date, events: [ event ] });
    }
    localStorage.setItem('database', JSON.stringify(dataBase));
    this.refreshDatabase();
    console.log('Запись успешно добавлена');
    this.router.navigate([ '/' ]);
  }

  getEventsByDate(date: Date): Event[] {
    let events: Event[] = [];
    this.db?.dates.forEach(eventDay => {
      if (new Date(JSON.parse(eventDay.date)).getTime() === date?.getTime()) {
        events = eventDay.events;
      }
    });
    return events;
  }

  getEventByID(id: string): Event | boolean {
    let response: Event | boolean = false;
    this.db.dates.forEach(eventDay => eventDay.events.forEach(event => {
      if (id === event.id.toString()) {
        response = event;
        return;
      }
    }));
    return response;
  }

  deleteEvent(removingEvent: Event): void {
    if (!this.db) return;
    this.db.dates.forEach(eventDay => {
      eventDay.events.forEach(event => {
        if (event.id === removingEvent.id) {
          this.db.dates[this.db.dates.indexOf(eventDay)].events;
          let date = this.db.dates[this.db.dates.indexOf(eventDay)];
          date.events.splice(date.events.indexOf(event), 1);
          if (date.events.length === 0) {
            this.db.dates.splice(this.db.dates.indexOf(eventDay), 1);
          }
          localStorage.setItem('database', JSON.stringify(this.db));
          console.log('Запись успешно удалена');
          this.refreshDatabase();
        }
      })
    });
  }
}
