import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { faCalendarCheck } from '@fortawesome/free-regular-svg-icons';
import { faCalendar, faCalendarAlt, faEdit, faExclamationTriangle, faEye, faEyeSlash, faPencilAlt, faStar, faTrash, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { AngularEmojisComponent } from 'angular-emojis';
import { Comment } from 'data/comments/comment';
import { Utilities } from 'data/utilities';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import {
  trigger,
  state,
  style,
  animate,
  transition,  
  // ...
} from '@angular/animations';
import { animationOptions, singleCommentAnimations } from './single-comment.animations';
import { BreakpointManager } from 'src/app/shared/utilities/breakpoint-manager';

@Component({
  selector: '[single-comment]',
  templateUrl: './single-comment.component.html',
  styleUrls: ['./single-comment.component.scss'],
  animations: singleCommentAnimations
})
export class SingleCommentComponent implements OnInit, OnChanges, OnDestroy {

  public static COMMENT_TEXT_BOUND: number = 100;
  public static HOST_MAX_HEIGHT: number = 180;
  public static HOST_MIN_HEIGHT: number = 180;

  @ViewChild('commentTextElementRef', {static: true, read: ElementRef}) commentText: ElementRef;
  @ViewChild('emojiIcon', {static: false, read: AngularEmojisComponent}) emojiIcon: AngularEmojisComponent;

  @HostBinding("@collapse") collapse: any;

  @HostListener('@collapse.start', ['$event']) start( event: any ): void {
    if ( event.fromState === "void" && event.toState === null )
      return;

      if ( event.fromState === null || event.toState === null || event.fromState === "void" || event.toState === "void" )
        return;
      
      if ( this.expanded.getValue() )
        this.host.nativeElement.classList.add("expanded");      
        
    
  }

  @HostListener('@collapse.done', ['$event']) done( event: any ): void {
    if ( event.fromState === "void" && event.toState === null )
      return;

      if ( event.fromState === null || event.toState === null || event.fromState === "void" || event.toState === "void" )
        return;

      console.log(event);
      
      if ( !this.expanded.getValue() ) {
        this.host.nativeElement.classList.remove("expanded");              
      }
        
    
  }

  @Input()
  set comment(c: Comment) {
    
    this.calculateDaysDiff(c);
    this.parseText(c);      
    this._comment = c;     
        
    if ( !this.firstTimeCheckExpansion ) {           
      this.displayScrollMore = false;
      setTimeout(() => {        
        this.expanded.next(false);   
        this.checkForLongComment(this.showWarningMessage);        
      }, 2000);
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

  originalHeight: number;
  collapsedHeight: number;

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

  @HostListener('window:resize', ['$event']) onResize(event: MouseEvent): void {
    this.expanded.next(false);    
    this.checkForLongComment(this.showWarningMessage);
  }

  ngOnDestroy(): void {
      this.expandedSubscription.unsubscribe();     
  }

  private resetAllSettingsForLongComment(): void {        
    this.commentText.nativeElement.style.height = "initial";
  }

  private checkForLongComment(showWarningMessage: boolean): void {

    this.host.nativeElement.classList.remove('with-max-height');
    this.host.nativeElement.classList.remove("not-expandable");
    this.host.nativeElement.classList.remove("expandable");
    this.host.nativeElement.style.height = "";
    this.displayScrollMore = false;    
    this.firstTimeCheckExpansion = false;

    setTimeout(() => {
      let offset: number;
      let device: number = BreakpointManager.getDeviceSizeAsNumber();    
      if ( device === BreakpointManager.XS ) {
        offset = showWarningMessage ? 80 : (this.isMyComment ? 50 : 20);    
        this.originalHeight = this.host.nativeElement.offsetHeight + (!showWarningMessage ? (this.isMyComment ? 97 : 35) : 0);  
      } else {
        offset = showWarningMessage ? 80 : (this.isMyComment ? 50 : 20);    
        this.originalHeight = this.host.nativeElement.offsetHeight + (!showWarningMessage ? (this.isMyComment ? 20 : 0) : 0);
      }

      setTimeout(() => {
        this.host.nativeElement.classList.add('with-max-height');
        this.collapsedHeight = this.host.nativeElement.offsetHeight;
        
        if ( this.host.nativeElement.offsetHeight-offset < this.commentText.nativeElement.offsetHeight ) {                  
          this.displayScrollMore = true;
  
          this.host.nativeElement.classList.remove("not-expandable");
          this.host.nativeElement.classList.add("expandable");
          this.collapse = {
            value: 'collapsed',
            params: {
              height: "*"
            }
          };      
        } else {
          this.host.nativeElement.classList.remove("expandable");
          this.host.nativeElement.classList.add("not-expandable");
          this.collapse = {
            value: 'not-collapsed',
            params: {
              height: "*"
            }
          };
        }
        
      }, 100);
    }, 100);    

    
    
  }

  readWholeComment(): void {        
    this.expanded.next(!this.expanded.getValue()); 
    let from: string = (this.expanded.getValue() ? this.collapsedHeight : this.originalHeight) + "px";
    let to: string = (!this.expanded.getValue() ? this.collapsedHeight : this.originalHeight) + "px";
    
    
    if ( this.expanded.getValue() ) {
      // Need to expand container
      this.host.nativeElement.style.height = this.collapsedHeight + "px";
      animationOptions.collapsed.height = from;
      animationOptions.notCollapsed.height = to;
    } else {
      // Need to collapse container
      this.host.nativeElement.style.height = this.originalHeight + "px";
      animationOptions.notCollapsed.height = from;
      animationOptions.collapsed.height = "0px";
    }
    console.log("from => to: " + from + " => " + to);  

    this.host.nativeElement.classList.remove('with-max-height');
    this.collapse = {
      value: this.expanded.getValue() ? 'not-collapsed' : 'collapsed'      
    };    
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
