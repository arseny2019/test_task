import { Injectable } from '@angular/core';
import { DataBase, EventDay, Event } from './app.model';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

@Injectable()
export class PostService {
  db$: BehaviorSubject<DataBase> = new BehaviorSubject<DataBase>({} as DataBase);

  constructor(private router: Router) {
    this.refreshDatabase();
  }

  get db(): DataBase {
    return this.db$.getValue();
  }

  updateEvent(newValue: Event, oldValue: Event): void {
    const currentDb = this.db;
    currentDb.dates.forEach(eventDay => {
      if (eventDay.date === oldValue.date) {
        const eventIndex = eventDay.events.findIndex(event => event.id === oldValue.id);
        eventDay.events[eventIndex] = newValue;
      }
    });

    this.updateDataBase(currentDb);
    console.log('Запись успешно обновлена');
    this.router.navigate([ '/' ]);
  }

  addNewEvent(event: Event): void {
    const currentDb = this.db;
    let currentDay = currentDb.dates.find(eventDay => eventDay.date === event.date);
    if (currentDay) {
      currentDay.events.push(event);
    } else {
      currentDb.dates.push({ date: event.date, events: [ event ] });
    }
    this.updateDataBase(currentDb);
    console.log('Запись успешно добавлена');
    this.router.navigate([ '/' ]);
  }

  getEventsByDate(date: Date): Event[] {
    let events: Event[] = [];
    this.db.dates.forEach(eventDay => {
      if (new Date(JSON.parse(eventDay.date)).getTime() === date?.getTime()) {
        events = eventDay.events;
      }
    });
    return events;
  }

  getEventByID(id: string): Event | undefined {
    return this.db.dates
      .map(date => date.events.find(event => id === event.id.toString()))
      .filter(Boolean)?.[0]
  }

  deleteEvent(removingEvent: Event): void {
    const currentDb = this.db;
    currentDb.dates.forEach((eventDay, dayIndex) => {
      eventDay.events.forEach((event, eventIndex) => {
        if (event.id === removingEvent.id) {
          eventDay.events.splice(eventIndex, 1);
          if (eventDay.events.length === 0) {
            currentDb.dates.splice(dayIndex, 1);
          }
          this.updateDataBase(currentDb);
          console.log('Запись успешно удалена');
        }
      })
    });
  }

  private refreshDatabase(): void {
    this.db$.next(JSON.parse(localStorage.getItem('database') ?? ''));
  }

  private updateDataBase(newValue: DataBase): void {
    localStorage.setItem('database', JSON.stringify(newValue));
    this.refreshDatabase();
  }
}
