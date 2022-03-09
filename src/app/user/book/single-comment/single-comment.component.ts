import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { faCalendarCheck } from '@fortawesome/free-regular-svg-icons';
import { faCalendar, faCalendarAlt, faEdit, faExclamationTriangle, faEye, faEyeSlash, faPencilAlt, faStar, faTrash, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { AngularEmojisComponent } from 'angular-emojis';
import { Comment } from 'data/comments/comment';
import { Utilities } from 'data/utilities';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  trigger,
  state,
  style,
  animate,
  transition,  
  // ...
} from '@angular/animations';

@Component({
  selector: '[single-comment]',
  templateUrl: './single-comment.component.html',
  styleUrls: ['./single-comment.component.scss'],
  animations: [
    trigger('collapse', [
      state('collapsed', style({        
        height: "{{startHeight}}px"
      }), { params: {
        startHeight: 250
      } }),
      state("not-collapsed", style({
        height: "500px"
      })),
      transition('collapsed => not-collapsed', [
        animate('1s ease')
      ]),
      transition('not-collapsed => collapsed', [
        animate('0.5s ease')
      ])
    ])    
  ]
})
export class SingleCommentComponent implements OnInit, OnChanges, OnDestroy {

  public static COMMENT_TEXT_BOUND: number = 100;
  public static HOST_MAX_HEIGHT: number = 180;
  public static HOST_MIN_HEIGHT: number = 180;

  @ViewChild('commentTextElementRef', {static: true, read: ElementRef}) commentText: ElementRef;
  @ViewChild('emojiIcon', {static: false, read: AngularEmojisComponent}) emojiIcon: AngularEmojisComponent;

  @HostBinding("@collapse") get getCollapse(): string {
    return this.expanded.getValue() ? 'not-collapsed' : 'collapsed';
  }

  @Input()
  set comment(c: Comment) {
    
    this.calculateDaysDiff(c);
    this.parseText(c);      
    this._comment = c; 
    
    this.resetAllSettingsForLongComment();
    if ( !this.firstTimeCheckExpansion ) {
      this.checkForLongComment(this.showWarningMessage);
    }
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

  expanded: BehaviorSubject<boolean>;
  expandedSubscription: Subscription;
  private firstTimeCheckExpansion: boolean;

  constructor(
    host: ElementRef,
    private cdr: ChangeDetectorRef
  ) { 
    this.firstTimeCheckExpansion = true;
    this.isMyComment = false;
    this.disabled = false;
    this.host = host;
    this.expanded = new BehaviorSubject<boolean>(false);
    this.expandedSubscription = this.expanded.subscribe((val: boolean) => {
      if ( val )
        this.host.nativeElement.classList.add("expanded");
      else
        this.host.nativeElement.classList.remove("expanded");
    });
  }

  ngOnInit(): void {      

    if ( !this.isMyComment )
      this.host.nativeElement.classList.add("shown");
      
    this.showWarningMessage = this.isMyComment;    

    if ( this.showWarningMessage )
      this.host.nativeElement.classList.add("has-warning-message");

    this.checkForLongComment(this.showWarningMessage);
    //this.expanded = false;
    //this.checkForLongComment();
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    if ( changes['showWarningMessage'] ) {
      if ( changes['showWarningMessage'].firstChange ) 
        return;
      if ( changes['showWarningMessage'].currentValue )      
        this.host.nativeElement.classList.add("has-warning-message");
      else 
        this.host.nativeElement.classList.remove("has-warning-message");      
      this.checkForLongComment( changes['showWarningMessage'].currentValue );      
    }
  }

  ngOnDestroy(): void {
      this.expandedSubscription.unsubscribe();
  }

  private resetAllSettingsForLongComment(): void {        
    this.commentText.nativeElement.style.height = "initial";
  }

  private checkForLongComment(showWarningMessage: boolean): void {
    this.displayScrollMore = false;
    let offset: number = showWarningMessage ? 320 : 20;
    console.log( offset + " " + (this.host.nativeElement.offsetHeight) + " " + this.commentText.nativeElement.offsetHeight);
    if ( this.host.nativeElement.offsetHeight-offset < this.commentText.nativeElement.offsetHeight ) {        
      this.host.nativeElement.classList.remove("not-expandable");
      this.host.nativeElement.classList.add("expandable");
      this.displayScrollMore = true;
    } else {
      this.host.nativeElement.classList.add("not-expandable");
    }
  }

  readWholeComment(): void {        
    this.expanded.next(!this.expanded.getValue());              
  }

  /**
   * ==============================================================================================
   *    Utilities regarding single comment
   * ==============================================================================================
   */

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

}
