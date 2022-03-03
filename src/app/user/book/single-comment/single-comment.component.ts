import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { faCalendarCheck } from '@fortawesome/free-regular-svg-icons';
import { faCalendar, faCalendarAlt, faEdit, faExclamationTriangle, faEye, faEyeSlash, faPencilAlt, faStar, faTrash, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { AngularEmojisComponent } from 'angular-emojis';
import { Comment } from 'data/comments/comment';
import { Utilities } from 'data/utilities';

@Component({
  selector: '[single-comment]',
  templateUrl: './single-comment.component.html',
  styleUrls: ['./single-comment.component.scss']
})
export class SingleCommentComponent implements OnInit, OnChanges {

  public static COMMENT_TEXT_BOUND: number = 100;
  public static HOST_MAX_HEIGHT: number = 180;
  public static HOST_MIN_HEIGHT: number = 180;

  @ViewChild('commentTextElementRef', {static: true, read: ElementRef}) commentText: ElementRef;
  @ViewChild('emojiIcon', {static: false, read: AngularEmojisComponent}) emojiIcon: AngularEmojisComponent;

  @Input()
  set comment(c: Comment) {
    
    this.calculateDaysDiff(c);
    this.parseText(c);      
    this._comment = c;  
        
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

  @Input()
  showWarningMessage: boolean;

  @Output()
  edit: EventEmitter<void> = new EventEmitter();

  @Output()
  delete: EventEmitter<void> = new EventEmitter();

  faStar: IconDefinition = faStar;
  faEdit: IconDefinition = faPencilAlt;
  faTrash: IconDefinition = faTrash;
  faEye: IconDefinition = faEye;
  faEyeSlashed: IconDefinition = faEyeSlash;
  faExclamation: IconDefinition = faExclamationTriangle;
  faCalendar: IconDefinition = faCalendarCheck;
  diffDays: number;
  host: ElementRef;
  displayScrollMore: boolean;
  expanded: boolean;

  constructor(
    host: ElementRef,
    private cdr: ChangeDetectorRef
  ) { 
    this.isMyComment = false;
    this.disabled = false;
    this.host = host;
  }

  ngOnInit(): void {  
    if ( !this.isMyComment )
      this.host.nativeElement.classList.add("shown");
      
    this.showWarningMessage = false;
    //this.expanded = false;
    //this.checkForLongComment();
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    this.host.nativeElement.style.maxHeight = SingleCommentComponent.HOST_MAX_HEIGHT + "px";
    this.commentText.nativeElement.style.maxHeight = "initial";
    this.checkForLongComment();

  }

  getDateForComment(): string {
    return Utilities.printDate(this.comment.dateCreated);
  }

  private calculateDaysDiff(c: Comment): void {
    let d1: Date = c.dateCreated;
    let canModify: Date = new Date();
    canModify.setTime(d1.getTime() + 1000*60*60*24*10);    
    
    this.diffDays = (canModify.getTime() - d1.getTime()) / (1000*60*60*24);
  }

  private parseText(c: Comment): void {
    let str: string = c.text;    
    this.commentText.nativeElement.innerHTML = str;   
  }

  deleteComment(): void {
    this.delete.emit();
  }

  editComment(): void {
    this.edit.emit();
  }

  private resetAllSettingsForLongComment(): void {        
    this.commentText.nativeElement.style.height = "initial";
  }

  private checkForLongComment(): void {
    this.displayScrollMore = false;
    if ( this.host.nativeElement.offsetHeight < this.commentText.nativeElement.offsetHeight ) {  
      console.log("here");  
      let maxHeight: number = SingleCommentComponent.HOST_MAX_HEIGHT;
      if ( this.showWarningMessage )
        maxHeight += 280;
      this.host.nativeElement.style.maxHeight = maxHeight + "px";  
      this.commentText.nativeElement.style.height = SingleCommentComponent.COMMENT_TEXT_BOUND + "px";
      this.displayScrollMore = true;
    };
  }

  private prepareForLongComment(): void {    
    if ( !this.expanded ) {
      this.host.nativeElement.style.minHeight = "initial";
      this.host.nativeElement.style.maxHeight = "initial";
      this.commentText.nativeElement.style.height = "initial";
    } else {
      this.host.nativeElement.style.minHeight = ((this.isMyComment ? 40 : 0) + SingleCommentComponent.HOST_MIN_HEIGHT) + "px";
      this.host.nativeElement.style.maxHeight = ((this.isMyComment ? 40 : 0) + SingleCommentComponent.HOST_MAX_HEIGHT) + "px";
      this.commentText.nativeElement.style.height = ((this.isMyComment ? 40 : 0) + SingleCommentComponent.COMMENT_TEXT_BOUND) + "px";
    }
  }

  readWholeComment(): void {
    this.prepareForLongComment();    
    this.expanded = !this.expanded;
  }

}
