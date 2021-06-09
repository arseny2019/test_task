import { Component, Input, OnInit } from '@angular/core';
import { Event } from '../app.model';
import { PostService } from '../post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: [ './event-card.component.scss' ]
})
export class EventCardComponent implements OnInit {
  @Input() event?: Event;

  constructor(
    private postService: PostService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  deleteEvent() {
    if (this.event) this.postService.deleteEvent(this.event);
  }

  editEvent() {
    this.router.navigate([ 'edit', this.event?.date ], {
      queryParams: { id: this.event?.id }
    })
  }
}
