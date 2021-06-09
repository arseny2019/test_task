export interface Event {
  id: string,
  title: string,
  type: EventTypes,
  data: string,
  date: string,
  additionData?: string,
}

export interface EventDay {
  date: string,
  events: Event[]
}

export enum EventTypes {
  Celebration = 'celebration',
  Meeting = 'meeting',
  Note = 'note'
}

export interface DataBase {
  dates: EventDay[]
}
