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
  isPresentMyComment: boolean;
  myComment: Comment;
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
    'triumph',
    'anguished',
    'neutral_face',
    'muscle',
    'sparkling_heart'
  ];
  emoji: string;
  disabledSuccessButton: boolean;
  showCommentError: boolean;
  showSuccessfulContent: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: TitleService,
    private findBookResolver: FindBookResolver,
    private recommendService: RecommendBookService,
    private cdr: ChangeDetectorRef
  ) {     
  }

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      let slug: string = param['slug'];
      this.book = BookDataManipulation.getBookBySlug(slug)!;
      if ( this.book === null )
        this.router.navigate([PathResolver.getPathForAllBooks()]);
    });
    this.titleService.changeTitle(this.book.title);   
    this.numberOfComments = this.findBookResolver.comments.length;   
    this.isPresentMyComment = this.findBookResolver.userHasComment; 
    this.myComment = this.findBookResolver.userComment; 
    this.comments = this.findBookResolver.comments;
    this.showLeaveCommentModal = false;
    this.showLeaveCommentContent = false;        
    this.emoji = this.emojis[0];
    this.myCanvas = confetti.create(this.myCanvasElement.nativeElement, {
      resize: true
    });

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
        })?.then(() => {
        
        }); 
      this.textarea.nativeElement.focus();
      this.showCommentError = true;
      this.showSuccessfulContent = false;
    });

    this.leaveComment();
  }

  ngOnDestroy(): void {
      this.selectedSubscription.unsubscribe();
      window.clearTimeout(this.animateEmojiTimeout);
      window.clearTimeout(this.animateEmojiInitiateTimeout);
      if ( this.myCanvas )
        this.myCanvas.reset();
  }

  private beforeOpenCommentModal(): void {
    if ( this.myCanvas )
      this.myCanvas.reset();
    this.rating = 0;
    this.chooseStar.reset();
    this.textarea.nativeElement.value = "";
    this.animateEmoji = false;
    this.disabledSuccessButton = true;
    this.showCommentError = false;
    window.clearTimeout(this.animateEmojiTimeout);
    window.clearTimeout(this.animateEmojiInitiateTimeout);
  }

  private canConfirmComment(): boolean {
    return this.rating > 0 && this.textarea.nativeElement.value.length >= 5;
  }

  private checkForErrors(): void {
    this.showCommentError = this.textarea.nativeElement.value.length < 5;
    this.disabledSuccessButton = this.showCommentError || this.rating === 0;
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

  leaveComment(): void {
    this.loader.getLoaderService().showLoader({
      transition: true,
      beforeOpened: (service: LoaderService) => {
        this.beforeOpenCommentModal();
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
      shown: (service: LoaderService) => {
        this.showSuccessfulContent = true;
        service.allowDismiss();
      }
    });
  }

  onDismissSuccessfulMessage(): void {
    this.loaderSuccessful.hideLoader(false).then(() => {
      this.loader.getLoaderService().hideLoader();
    });
  }

  declineComment(event: Event): void {
    this.onModalDismiss();
  }

  commentKeyup(event: KeyboardEvent): void {
    this.checkForErrors();
  }

}
