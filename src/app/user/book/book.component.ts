import { ChangeDetectorRef, Component, ElementRef, HostBinding, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faBookmark, faCheckCircle, faChevronDown, faChevronRight, faComment, faCommenting, faComments, faCommentSlash, faEye, faFlag, faFlagCheckered, faHomeUser, faStar, faTimes, faTimesCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Book } from 'data/book/book';
import { BookDataManipulation } from 'data/book/book-data-manipulation';
import { Comment, Comments } from 'data/comments/comment';
import { PathResolver } from 'data/path-resolver';
import { Subscription } from 'rxjs';
import { ChooseStarComponent } from 'src/app/shared/components/choose-star/choose-star.component';
import { LoaderComponent } from 'src/app/shared/components/loader/loader.component';
import { LoaderService } from 'src/app/shared/services/modals/loader-service';
import { RecommendBookService } from 'src/app/shared/services/modals/recommend-book-service';
import { TitleService } from 'src/app/shared/services/title-service';
import { FindBookResolver } from './find-book-resolver';
import * as confetti from 'canvas-confetti';
import { AngularEmojisComponent } from 'angular-emojis';
import { LoaderSuccessfulComponent } from 'src/app/shared/components/loader/loader-successful/loader-successful.component';
import { UserDataManipulation } from 'data/users/input.data';
import { BookRecommendationController } from 'data/book/recommendation/book-recommendation-controller';
import { SelectionService } from 'src/app/shared/service/selection.service';
import { CommentsDataManipulation } from 'data/comments/comments-data-manipulation';
import { environment } from 'src/environments/environment';
import { SingleCommentComponent } from './single-comment/single-comment.component';
import { CommentsSectionComponent } from './comments-section/comments-section.component';
import { Utilities } from 'data/utilities';
import { animations } from './book.animations';
import { BreakpointManager } from 'src/app/shared/utilities/breakpoint-manager';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  animations: animations
})
export class BookComponent implements OnInit, OnDestroy {

  @ViewChild('commentsSection', {read: CommentsSectionComponent, static: true}) commentsSection: CommentsSectionComponent;
  @ViewChild('myCommentComponent', {read: SingleCommentComponent, static: false}) myCommentComponent: SingleCommentComponent;

  faHome: IconDefinition = faHomeUser;
  faChevronRight: IconDefinition = faChevronRight;
  faChevronDown: IconDefinition = faChevronDown;
  faStar: IconDefinition = faStar;
  faComments: IconDefinition = faCommenting;
  faBookmark: IconDefinition = faBookmark;
  faEye: IconDefinition = faEye;
  faFlag: IconDefinition = faFlag;
  faComment: IconDefinition = faComment;
  faCommentSlash: IconDefinition = faCommentSlash;
  faTimes: IconDefinition = faTimesCircle;
  faCheck: IconDefinition = faCheckCircle;
  chevron: IconDefinition;

  emojis: string[] = [
    'rage',
    'anguished',
    'neutral_face',
    'muscle',
    'sparkling_heart'
  ];

  book: Book;
  numberOfComments: number;
  isPresentMyComment: boolean;
  myComment: Comment;
  showMyComment: boolean;
  isShownMyComment: boolean;
  comments: Comments;
  markedForDeletion: boolean;  
  showWarningMessage: boolean;

  animationLeftContent: any = 'hidden';
  animationCenterContent: any;
  animationRightContent: any;
  fadeInContentAnimation: any;

  constructor(
    private titleService: TitleService,
    private findBookResolver: FindBookResolver,
    private recommendService: RecommendBookService    
  ) {   
    this.fadeInContentAnimation = {
      value: 'hidden'
    };
    /*    
    this.animationLeftContent = {
      value: 'hidden'
    };
    this.animationCenterContent = {
      value: 'hidden'
    };
    this.animationRightContent = {
      value: 'hidden'
    }*/
  }

  ngOnInit(): void {

    // Get book & set the title of the document
    this.book = this.findBookResolver.book;
    this.titleService.changeTitle(this.book.title);       
    
    // Get data from book resolver
    this.numberOfComments = this.findBookResolver.getNumberOfComments();       
    this.myComment = this.findBookResolver.userComment; 
    this.comments = this.findBookResolver.comments;
    this.isPresentMyComment = this.findBookResolver.userHasComment;         
    setTimeout(() => {
      this.showMyComment = this.isPresentMyComment;
      if ( this.showMyComment ) {
        setTimeout(() => {
          this.showMyComment = false;
          this.isShownMyComment = true;
        }, 3000);
      }
    }, 10);  
    
    this.checkChevronIcon();

    this.markedForDeletion = false;
    
  }

  ngOnDestroy(): void {
      
  }

  @HostListener('window:resize', ['$event']) resize(event: Event): void {
    this.checkChevronIcon();
  }

  getLinkForAllBooks(): string {
    return PathResolver.getPathForAllBooks();
  }

  getMainPrice(): string {
    return Utilities.getMainPrice(this.book.price);
  }

  getPennies(): string {
    return Utilities.getPennies(this.book.price);
  }

  getImageForBook(): string {
    return PathResolver.BOOK_PICTURE_DIRECTORY + this.book.image;
  }

  onRecommend(): void {
    this.recommendService.openModal(this.book);
  }

  leaveComment(op: 'open' | 'edit' = 'open'): void {
    this.commentsSection.leaveComment(op);
  }

  onModalDismiss(): void {
    
  }

  getRecommendations(): number {
    return BookRecommendationController.getSentRecommendationNumberFor(this.book);
  }

  getCommentsNumber(): number {
    return CommentsDataManipulation.getCommentNumberForBook(this.book);
  }

  getAverageValue(): string {
    return CommentsDataManipulation.getAverageForBook(this.book).toFixed(1);
  }

  checkIfCommentActionsShouldBeDisabled(): boolean {
    return this.commentsSection.checkIfCommentActionsShouldBeDisabled();
  }

  onEditComment(comment: Comment | null): void {
    this.leaveComment('edit');    
  }

  onDeleteComment(comment: Comment | null): void {
    this.commentsSection.deleteComment();    
  }

  deleteMyComment(): void {
    this.markedForDeletion = true;
    this.showMyComment = false;    
    this.isShownMyComment = false;    
    setTimeout(() => {      
      this.isPresentMyComment = false;   
      this.markedForDeletion = false;  
      this.numberOfComments--;      
    }, 1000);
  }

  @HostListener('@fadeInContent.done', ['$event']) doneFadingIn(event: any) {
    console.log(event);
  }

  doneAnimation(event: any): void {    
    setTimeout(() => {
      this.fadeInContentAnimation = {
        value: 'shown'
      }
    }, 300);
  }

  private checkChevronIcon(): void {
    if ( BreakpointManager.getDeviceSizeAsNumber() > BreakpointManager.XS ) {
      this.chevron = faChevronRight;
    } else {
      this.chevron = faChevronDown;
    }
  }

}
