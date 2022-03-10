import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { faBookmark, faCheckCircle, faChevronRight, faComment, faCommenting, faCommentSlash, faEye, faFlag, faHomeUser, faStar, faTimesCircle, faTrashAlt, faTrashCanArrowUp, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { AngularEmojisComponent } from 'angular-emojis';
import * as confetti from 'canvas-confetti';
import { Book } from 'data/book/book';
import { BookDataManipulation } from 'data/book/book-data-manipulation';
import { BookRecommendationController } from 'data/book/recommendation/book-recommendation-controller';
import { Comment } from 'data/comments/comment';
import { CommentsDataManipulation } from 'data/comments/comments-data-manipulation';
import { UserDataManipulation } from 'data/users/input.data';
import { Subscription } from 'rxjs';
import { ChooseStarComponent } from 'src/app/shared/components/choose-star/choose-star.component';
import { LoaderDeleteComponent } from 'src/app/shared/components/loader/loader-delete/loader-delete.component';
import { LoaderSuccessfulComponent } from 'src/app/shared/components/loader/loader-successful/loader-successful.component';
import { LoaderComponent } from 'src/app/shared/components/loader/loader.component';
import { SelectionService } from 'src/app/shared/service/selection.service';
import { LoaderService } from 'src/app/shared/services/modals/loader-service';
import { RecommendBookService } from 'src/app/shared/services/modals/recommend-book-service';
import { BreakpointManager } from 'src/app/shared/utilities/breakpoint-manager';
import { environment } from 'src/environments/environment';
import { BookComponent } from '../book.component';
import { FindBookResolver } from '../find-book-resolver';

@Component({
  selector: 'perce-comments-section',
  templateUrl: './comments-section.component.html',
  styleUrls: ['./comments-section.component.scss']
})
export class CommentsSectionComponent implements OnInit {

  @ViewChild('loader', {static: true, read: LoaderComponent}) loader: LoaderComponent;
  @ViewChild('chooseStar', {static: true, read: ChooseStarComponent}) chooseStar: ChooseStarComponent;
  @ViewChild('myCanvas', {static: true, read: ElementRef}) myCanvasElement: ElementRef;
  @ViewChild('emojiComponent', {read: AngularEmojisComponent, static: true}) emojiComponent: AngularEmojisComponent;
  @ViewChild('textarea', {read: ElementRef, static: true}) textarea: ElementRef;  
  @ViewChild('loaderSuccessful', {read: LoaderSuccessfulComponent, static: true}) loaderSuccessful: LoaderSuccessfulComponent;  
  @ViewChild('loaderSuccessfulDelete', {read: LoaderSuccessfulComponent, static: true}) loaderSuccessfulDelete: LoaderSuccessfulComponent; 
  @ViewChild('loaderDeleteComment', {read: LoaderDeleteComponent, static: true}) loaderDeleteComment: LoaderDeleteComponent; 

  faHome: IconDefinition = faHomeUser;
  faChevronRight: IconDefinition = faChevronRight;
  faStar: IconDefinition = faStar;
  faComments: IconDefinition = faCommenting;
  faBookmark: IconDefinition = faBookmark;
  faEye: IconDefinition = faEye;
  faFlag: IconDefinition = faFlag;
  faComment: IconDefinition = faComment;
  faCommentSlash: IconDefinition = faCommentSlash;
  faTimes: IconDefinition = faTimesCircle;
  faCheck: IconDefinition = faCheckCircle;
  faTrash: IconDefinition = faTrashCanArrowUp;

  book: Book;  
  isContentEditable: boolean;
  isCommentTextareaInPlaceholderMode: boolean;
  showLeaveCommentModal: boolean;
  showLeaveCommentContent: boolean;
  rating: number;
  selectedSubscription: Subscription;  
  myCanvas: any;
  animateEmoji: boolean;
  animateEmojiTimeout: number;
  animateEmojiInitiateTimeout: number;  
  emoji: string;
  disabledSuccessButton: boolean;
  showCommentError: boolean;
  showSuccessfulContent: boolean;

  // Modal leave comment
  modalTitle: string;
  modalMode: 'open' | 'edit';
  selectionTextareaSubscription: Subscription;
  mouseInsideCommentTextarea: boolean;
  forceDisableActions: boolean;  

  // Modal delete comment
  showDeleteContent: boolean;

  // Modal successful delete comment
  showSuccessfulDeleteContent: boolean;

  constructor(    
    private findBookResolver: FindBookResolver,
    private cdr: ChangeDetectorRef,
    private selectionService: SelectionService,
    
    @Inject(BookComponent)
    private parent: BookComponent
  ) {     
  }

  ngOnInit(): void {

    this.book = this.findBookResolver.book;
    this.showLeaveCommentModal = false;
    this.showLeaveCommentContent = false;        
    this.emoji = this.parent.emojis[0];
    this.myCanvas = confetti.create(this.myCanvasElement.nativeElement, {
      resize: true
    });    

    // Set IDs on loaders
    this.loaderSuccessful.getLoaderService().setID("comment-successful-loader");
    this.loader.getLoaderService().setID("comment-loader");

    this.selectedSubscription = this.chooseStar.selected.subscribe((rating: number) => {
      this.rating = rating;
      this.emoji = this.parent.emojis[rating-1];      
      this.animateEmoji = false;      
      this.cdr.detectChanges();
      this.emojiComponent.size = BreakpointManager.getDeviceSizeAsNumber() === BreakpointManager.XS ? '35' : '45';
      this.emojiComponent.ngOnInit();
      this.checkForErrors();
      window.clearTimeout(this.animateEmojiInitiateTimeout);
      this.animateEmojiInitiateTimeout = window.setTimeout(() => {
        window.clearTimeout(this.animateEmojiTimeout);
        this.animateEmojiTimeout = window.setTimeout(() => {
          this.animateEmoji = true;
        }, 100);      
      }, 50);      
      if ( rating == 5 )  
        this.myCanvas({
          zIndex: 99999,
          particleCount: 100,          
          spread: 100,
          origin: { y: 0.6 }
        }); 
      this.canConfirmTextarea();
      this.textarea.nativeElement.focus();      
      this.showSuccessfulContent = false;
      this.checkForErrors();
    });

    // Handle selection on textarea.
    this.selectionTextareaSubscription = this.selectionService.getOnSelectStartObservable().subscribe((event: any) => {               
      try {
        if ( this.showLeaveCommentModal ) {                 
          this.selectionService.allowToSelect();
        } else
          this.selectionService.disallowToSelect();
      } catch(e) {}   
    }); 
  }

  ngOnDestroy(): void {
      this.selectedSubscription.unsubscribe();
      window.clearTimeout(this.animateEmojiTimeout);
      window.clearTimeout(this.animateEmojiInitiateTimeout);
      if ( this.myCanvas )
        this.myCanvas.reset();
      this.selectionTextareaSubscription.unsubscribe();
  }

  private beforeOpenCommentModal(op: 'open' | 'edit' = 'open'): void {

    this.modalMode = op;    
    if ( op === "open" ) {
      this.rating = 0;      
      this.chooseStar.reset();
      this.textarea.nativeElement.innerHTML = "Unesite željeni komentar za ovu knjigu"; 
      this.isCommentTextareaInPlaceholderMode = true;         
      this.modalTitle = "Unesite ocenu";
    } else {
      
      this.modalTitle = "Izmenite ocenu";      
      this.rating = this.parent.myComment?.rating!;      
      this.textarea.nativeElement.innerHTML = this.parent.myComment?.text; 
      this.isCommentTextareaInPlaceholderMode = false;   
      this.chooseStar.selectStar(this.parent.myComment?.rating!-1, false);
    }
    
    this.mouseInsideCommentTextarea = false;
    if ( this.myCanvas )
      this.myCanvas.reset();
    this.animateEmoji = false;
    this.disabledSuccessButton = true;
    this.showCommentError = false;
    
    window.clearTimeout(this.animateEmojiTimeout);
    window.clearTimeout(this.animateEmojiInitiateTimeout);
  }

  private canConfirmComment(): boolean {
    return this.rating > 0 && this.canConfirmTextarea();
  }

  private canConfirmTextarea(): boolean {
    let str: string = this.textarea.nativeElement.innerHTML;      
    const tags = /<[^>]*>/g;
    const output = str.replace(tags, '');    
    return output.length >= 5;
  }

  private checkForErrors(): void {
    this.showCommentError = !this.canConfirmTextarea();
    this.disabledSuccessButton = this.showCommentError || this.rating === 0;
  }

  /**
   * Adds new self comment to the page.
   * 
   * @returns Promise\<void>
   */
  private addNewComment(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        this.parent.myComment = {
          bookID: this.book.id,
          dateCreated: new Date(),
          dateModified: new Date(),
          rating: this.rating,
          text: this.textarea.nativeElement.innerHTML,
          user: UserDataManipulation.getUserForDisplay(UserDataManipulation.getLoggedInUser().username)!
        };
        this.parent.isPresentMyComment = true;        
        this.parent.numberOfComments++;

        // Add comment to the database.
        CommentsDataManipulation.insertComment(this.parent.myComment, 'insert');

        this.forceDisableActions = true; 
        this.parent.showWarningMessage = true;  
        
        setTimeout(() => {
          this.parent.showMyComment = true;
          setTimeout(() => {
            this.parent.showMyComment = false;
            this.parent.isShownMyComment = true;
          }, 3000);
          resolve();
        }, 50);        
      }, 900);
    });
  }

  private updateComment(): Promise<void> {
    return new Promise<void>((resolve, reject) => {      
      setTimeout(() => {
        if ( this.parent.myComment === null ) {
          resolve();
          return;
        }

        this.parent.myComment.rating = this.rating;
        this.parent.myComment.text = this.textarea.nativeElement.innerHTML;
        this.parent.myComment.dateModified = new Date(); 
        this.forceDisableActions = true;  
        this.parent.showWarningMessage = true;                    

        // Edit comment inside the database.
        CommentsDataManipulation.insertComment(this.parent.myComment, 'edit');      
        
        // Disable actions on comment by force.
        this.forceDisableActions = true;  

        // Refresh single-comment.component        
        this.parent.myCommentComponent.comment = this.parent.myComment;                             

        resolve();       
      }, 900);
    });
  }

  leaveComment(op: 'open' | 'edit' = 'open'): void {
    this.loader.getLoaderService().showLoader({      
      transition: true,
      beforeOpened: (service: LoaderService) => {
        this.beforeOpenCommentModal(op);
      },
      fetchData: () => new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 450);
      }),
      shown: (service: LoaderService) => {        
        service.allowDismiss();
        this.showLeaveCommentModal = true;   
        this.showLeaveCommentContent = true;   
      }
    })
  }

  onModalDismiss(): void {
    this.showLeaveCommentContent = false;
    this.loader.getLoaderService().hideLoader().then(() => {
      this.showLeaveCommentModal = false;
    })
  }

  confirmComment(event: Event): void {
    if ( !this.canConfirmComment() )
      return;
    this.loader.getLoaderService().disallowDismiss();
    this.showSuccessfulContent = false;    

    this.loaderSuccessful.showLoader({      
      transition: true,
      transitionDelayShow: 500,
      fetchData: () => {
        // Add new comment to the database    
        if ( this.modalMode === 'open' )    
          return this.addNewComment();
        else
          return this.updateComment();
      },
      shown: (service: LoaderService) => {
        this.showSuccessfulContent = true;
        service.allowDismiss();
      }
    });
  }

  onDismissSuccessfulMessage(): void {       
    this.loaderSuccessful.hideLoader(false).then(() => {
      this.showLeaveCommentContent = false;      
      this.loader.getLoaderService().hideLoader().then(() => {
        this.showLeaveCommentModal = false;
      });
    });
  }

  declineComment(event: Event): void {
    this.onModalDismiss();
  }

  commentKeyup(event: KeyboardEvent): void {
    this.checkForErrors();
  }

  checkIfCommentActionsShouldBeDisabled(): boolean {
    if ( !this.parent.myComment )
      return false;

    if ( this.forceDisableActions )
      return true;

    let d: Date = this.parent.myComment.dateModified;
    var diff = Math.floor(((new Date()).getTime() - d.getTime()) / 86400000);       
    if ( environment.production )
      return diff <= 10;
    else
      return false;
  }

  commentTextfieldClick(event: Event): void {          
    if ( !this.canConfirmTextarea() )
      this.showCommentError = true;
    this.textarea.nativeElement.focus();          
  }

  commentTextfieldFocus(event: Event): void {
    if ( this.isCommentTextareaInPlaceholderMode ) {
      this.isCommentTextareaInPlaceholderMode = false;
      this.textarea.nativeElement.innerHTML = ""; 
    };
  }

  commentTextfieldFocusout(event: Event): void {
    if ( this.textarea.nativeElement.innerHTML === "" ) {
      this.isCommentTextareaInPlaceholderMode = true;
      this.textarea.nativeElement.innerHTML = "Unesite željeni komentar za ovu knjigu";      
    };
  }

  commentTextfieldMouseenter(event: Event): void {
    this.mouseInsideCommentTextarea = true;
  }

  commentTextfieldMouseleave(event: Event): void {
    this.mouseInsideCommentTextarea = false;
  }

  // Delete Loader Methods

  onDeclineDeleteComment(): void {
    this.loaderDeleteComment.hideLoader(false);
  }

  onConfirmDeleteComment(): void {
    this.loaderSuccessfulDelete.showLoader({
      transition: true,
      transitionDelayShow: 150,
      fetchData: (service: LoaderService) => new Promise<void>((resolve, reject) => {
        // Go to database and delete current comment
        CommentsDataManipulation.deleteComment(this.parent.myComment);
        setTimeout(() => {
          resolve();
        }, 400);
      })
    })
  }

  // Successful Delete Loader Methods
  deleteComment(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.loaderDeleteComment.showLoader({
        transition: true,
        transitionDelayShow: 200,
        shown: (service: LoaderService) => {                              
          resolve();
        }
      });
    });    
  }

  onDismissSuccessfulDeleteMessage(): void {
    this.loaderSuccessfulDelete.hideLoader(true).then(() => {
      this.loaderDeleteComment.hideLoader(false).then(() => {    
        this.forceDisableActions = true;        
        this.parent.deleteMyComment();
      });
    })
  }


}
