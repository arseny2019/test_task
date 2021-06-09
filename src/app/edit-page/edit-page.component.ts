import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EventTypes } from '../app.model';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../post.service';
import { Event } from '../app.model';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: [ './edit-page.component.scss' ]
})
export class EditPageComponent implements OnInit {
  form?: FormGroup;
  defaultType: EventTypes = EventTypes.Meeting;
  currentType: string = this.defaultType;
  eventDate: string = '';
  id: string = '';
  editedEvent?: Event;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) {
    this.route.params.subscribe(
      params => this.eventDate = params.date
    );
    this.route.queryParams.subscribe(
      queryParams => {
        this.id = queryParams.id;
        if (this.id) {
          this.editedEvent = this.postService.getEventByID(this.id);
          if (this.editedEvent) this.defaultType = this.currentType = this.editedEvent.type;
        }
      }
    );
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(this.editedEvent?.title ?? '', [ Validators.required ]),
      type: new FormControl(this.defaultType),
      note: new FormControl(this.editedEvent?.data ?? '', [ Validators.required, Validators.minLength(4) ]),
      budget: new FormControl(this.editedEvent?.data ?? '', [ Validators.required ]),
      address: new FormControl(this.editedEvent?.additionData ?? '', [ Validators.required, Validators.minLength(4) ]),
      time: new FormControl(this.editedEvent?.data ?? '8:00', [ Validators.required ])
    });
    this.typeChange(this.currentType);
  }

  submit() {
    if (this.editedEvent) {
      this.postService.updateEvent(this.getNewEvent(), this.editedEvent)
    } else {
      this.postService.addNewEvent(this.getNewEvent());
    }
  }

  typeChange(e: string) {
    this.currentType = e;
    switch (e) {
      case EventTypes.Meeting:
        this.enableMeetingFields();
        break;
      case EventTypes.Celebration:
        this.enableCelebrationFields();
        break;
      case EventTypes.Note:
        this.enableNoteFields();
        break;
    }
  }

  private enableMeetingFields(): void {
    this.form?.get('note')?.disable();
    this.form?.get('note')?.reset();
    this.form?.get('budget')?.disable();
    this.form?.get('budget')?.reset();
    this.form?.get('address')?.enable();
    this.form?.get('time')?.enable();
  }

  private enableNoteFields(): void {
    this.form?.get('note')?.enable();
    this.form?.get('budget')?.disable();
    this.form?.get('budget')?.reset();
    this.form?.get('address')?.disable();
    this.form?.get('address')?.reset();
    this.form?.get('time')?.disable();
    this.form?.get('time')?.reset();
  }

  private enableCelebrationFields(): void {
    this.form?.get('note')?.disable();
    this.form?.get('note')?.reset();
    this.form?.get('budget')?.enable();
    this.form?.get('address')?.disable();
    this.form?.get('address')?.reset();
    this.form?.get('time')?.disable();
    this.form?.get('time')?.reset();
  }

  private getNewEvent(): Event {
    let event: Partial<Event> = {
      id: new Date().getTime().toString(),
      date: this.eventDate,
      title: this.form?.get('title')?.value,
    };
    switch (this.currentType) {
      case EventTypes.Meeting:
        return {
          ...event,
          type: EventTypes.Meeting,
          data: this.form?.get('time')?.value,
          additionData: this.form?.get('address')?.value
        } as Event;
      case EventTypes.Celebration:
        return {
          ...event,
          type: EventTypes.Celebration,
          data: this.form?.get('budget')?.value
        } as Event;
      default:
        return {
          ...event,
          type: EventTypes.Note,
          data: this.form?.get('note')?.value
        } as Event;
    }
  }
}
