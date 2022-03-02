import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faBookmark, faCheckCircle, faChevronRight, faComment, faCommenting, faComments, faCommentSlash, faEye, faFlag, faFlagCheckered, faHomeUser, faStar, faTimes, faTimesCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons';
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

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit, OnDestroy {

  @ViewChild('loader', {static: true, read: LoaderComponent}) loader: LoaderComponent;
  @ViewChild('chooseStar', {static: true, read: ChooseStarComponent}) chooseStar: ChooseStarComponent;
  @ViewChild('myCanvas', {static: true, read: ElementRef}) myCanvasElement: ElementRef;
  @ViewChild('emojiComponent', {read: AngularEmojisComponent, static: true}) emojiComponent: AngularEmojisComponent;
  @ViewChild('textarea', {read: ElementRef, static: true}) textarea: ElementRef;  
  @ViewChild('loaderSuccessful', {read: LoaderSuccessfulComponent, static: true}) loaderSuccessful: LoaderSuccessfulComponent;
  @ViewChild('myCommentComponent', {read: SingleCommentComponent, static: false}) myCommentComponent: SingleCommentComponent;

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

  book: Book;  
  numberOfComments: number;
  isContentEditable: boolean;
  isPresentMyComment: boolean;
  isCommentTextareaInPlaceholderMode: boolean;
  myComment: Comment | null;
  showMyComment: boolean;
  comments: Comments;
  showLeaveCommentModal: boolean;
  showLeaveCommentContent: boolean;
  rating: number;
  selectedSubscription: Subscription;  
  myCanvas: any;
  animateEmoji: boolean;
  animateEmojiTimeout: number;
  animateEmojiInitiateTimeout: number;
  emojis: string[] = [
    'rage',
    'anguished',
    'neutral_face',
    'muscle',
    'sparkling_heart'
  ];
  emoji: string;
  disabledSuccessButton: boolean;
  showCommentError: boolean;
  showSuccessfulContent: boolean;

  // Modal leave comment
  modalTitle: string;
  modalMode: string;
  selectionTextareaSubscription: Subscription;
  mouseInsideCommentTextarea: boolean;
  forceDisableActions: boolean;  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: TitleService,
    private findBookResolver: FindBookResolver,
    private recommendService: RecommendBookService,
    private cdr: ChangeDetectorRef,
    private selectionService: SelectionService
  ) {     
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
    }, 10)

    this.showLeaveCommentModal = false;
    this.showLeaveCommentContent = false;        
    this.emoji = this.emojis[0];
    this.myCanvas = confetti.create(this.myCanvasElement.nativeElement, {
      resize: true
    });
    this.showMyComment = false;

    // Set IDs on loaders
    this.loaderSuccessful.getLoaderService().setID("comment-successful-loader");
    this.loader.getLoaderService().setID("comment-loader");

    this.selectedSubscription = this.chooseStar.selected.subscribe((rating: number) => {
      this.rating = rating;
      this.emoji = this.emojis[rating-1];      
      this.animateEmoji = false;      
      this.cdr.detectChanges();
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

    // Check if there are comments for this book.    
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
      this.rating = this.myComment?.rating!;      
      this.textarea.nativeElement.innerHTML = this.myComment?.text; 
      this.isCommentTextareaInPlaceholderMode = false;   
      this.chooseStar.selectStar(this.myComment?.rating!-1, false);
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

  private addNewComment(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        this.myComment = {
          bookID: this.book.id,
          dateCreated: new Date(),
          dateModified: new Date(),
          rating: this.rating,
          text: this.textarea.nativeElement.innerHTML,
          user: UserDataManipulation.getUserForDisplay(UserDataManipulation.getLoggedInUser().username)!
        };
        this.isPresentMyComment = true;        
        this.numberOfComments++;

        // Add comment to the database.
        CommentsDataManipulation.insertComment(this.myComment, 'insert');
        
        setTimeout(() => {
          this.showMyComment = true;
          resolve();
        }, 50);        
      }, 900);
    });
  }

  private updateComment(): Promise<void> {
    return new Promise<void>((resolve, reject) => {      
      setTimeout(() => {
        if ( this.myComment === null ) {
          resolve();
          return;
        }

        this.myComment.rating = this.rating;
        this.myComment.text = this.textarea.nativeElement.innerHTML;
        this.myComment.dateModified = new Date();                       

        // Edit comment inside the database.
        CommentsDataManipulation.insertComment(this.myComment, 'edit');      
        
        // Disable actions on comment by force.
        this.forceDisableActions = true;  

        // Refresh single-comment.component
        this.myCommentComponent.comment = this.myComment;                             

        resolve();       
      }, 900);
    });
  }

  getLinkForAllBooks(): string {
    return PathResolver.getPathForAllBooks();
  }

  getMainPrice(): string {
    let s: string = "";
    let p: number;    

    p = Math.floor(this.book.price);
    s += p.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&.');
    s = s.replace(/\.\d{2}$/g, '');

    return s;
  }

  getPennies(): string {
    let p: number = Math.floor(this.book.price);
    let p1: number = (this.book.price - p) * 100;
    p1 = Math.floor(p1);
    let s: string;
    if ( p1 < 10 ) {
      s = "0" + p1;      
    } else {
      s = String(p1);
    } 
    return s;
  }

  getImageForBook(): string {
    return PathResolver.BOOK_PICTURE_DIRECTORY + this.book.image;
  }

  onRecommend(): void {
    this.recommendService.openModal(this.book);
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
        if ( this.modalMode === 'insert' )    
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
    if ( !this.myComment )
      return false;

    if ( this.forceDisableActions )
      return true;

    let d: Date = this.myComment.dateModified;
    var diff = Math.floor(((new Date()).getTime() - d.getTime()) / 86400000);       
    if ( environment.production )
      return diff <= 10;
    else
      return false;
  }

  getRecommendations(): number {
    return BookRecommendationController.getSentRecommendationNumberFor(this.book);
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

  onEditComment(comment: Comment | null): void {
    this.leaveComment('edit');    
  }

  onDeleteComment(comment: Comment | null): void {

  }

}
