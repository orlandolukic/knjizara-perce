import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { faCalendarCheck } from '@fortawesome/free-regular-svg-icons';
import { faCalendar, faCalendarAlt, faEdit, faExclamationTriangle, faPencilAlt, faStar, faTrash, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { AngularEmojisComponent } from 'angular-emojis';
import { Comment } from 'data/comments/comment';
import { Utilities } from 'data/utilities';

@Component({
  selector: '[single-comment]',
  templateUrl: './single-comment.component.html',
  styleUrls: ['./single-comment.component.scss']
})
export class SingleCommentComponent implements OnInit {

  @ViewChild('commentTextElementRef', {static: true, read: ElementRef}) commentText: ElementRef;
  @ViewChild('emojiIcon', {static: false, read: AngularEmojisComponent}) emojiIcon: AngularEmojisComponent;

  @Input()
  set comment(c: Comment) {
    this._comment = c;
    this.calculateDaysDiff();
    this.parseText();       
  }
  get comment(): Comment { return this._comment; }
  private _comment: Comment;

  @Input()
  isMyComment: boolean;

  @Input()
  set emoji(e: string | undefined) {
    this._emoji = e;

    if ( this.emojiIcon ) {      
      this.emojiIcon.name = e!;
      this.emojiIcon.ngOnInit();      
    }
  }
  get emoji(): string | undefined { return this._emoji; }
  private _emoji: string | undefined;

  @Input()
  disabled: boolean;

  @Output()
  edit: EventEmitter<void> = new EventEmitter();

  @Output()
  delete: EventEmitter<void> = new EventEmitter();

  faStar: IconDefinition = faStar;
  faEdit: IconDefinition = faPencilAlt;
  faTrash: IconDefinition = faTrash;
  faExclamation: IconDefinition = faExclamationTriangle;
  faCalendar: IconDefinition = faCalendarCheck;
  diffDays: number;

  constructor(
    private host: ElementRef,
    private cdr: ChangeDetectorRef
  ) { 
    this.isMyComment = false;
    this.disabled = false;
  }

  ngOnInit(): void {  
    if ( !this.isMyComment )
      this.host.nativeElement.classList.add("shown");      
  }

  getDateForComment(): string {
    return Utilities.printDate(this.comment.dateCreated);
  }

  private calculateDaysDiff(): void {
    let d1: Date = this.comment.dateCreated;
    let canModify: Date = new Date();
    canModify.setTime(d1.getTime() + 1000*60*60*24*10);    
    
    this.diffDays = (canModify.getTime() - d1.getTime()) / (1000*60*60*24);
  }

  private parseText(): void {
    let str: string = this.comment.text;    
    this.commentText.nativeElement.innerHTML = str;
  }

  deleteComment(): void {
    this.delete.emit();
  }

  editComment(): void {
    this.edit.emit();
  }

}
