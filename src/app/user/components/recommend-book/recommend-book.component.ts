import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { faBookmark, faCheckCircle as faCheckCircleFull, faCheckDouble, faCircleNotch, faQuestionCircle, faSearch, faStar, faTimes, faTimesCircle, faTrashAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import {  faCheckCircle as faCheckCircleEmpty } from '@fortawesome/free-regular-svg-icons';
import { Book } from 'data/book/book';
import { BookRecommendationUserList } from 'data/book/book-recommendation-user-list';
import { UserDataManipulation } from 'data/users/input.data';
import { Buyer, User } from 'data/users/user';
import { Subject, Subscription } from 'rxjs';
import { RecommendBookService } from 'src/app/shared/services/modals/recommend-book-service';
import { BookRecommendationController } from 'data/book/recommendation/book-recommendation-controller';
import { UserBasicData } from 'data/users/user-basic-data';

@Component({
  selector: 'app-recommend-book',
  templateUrl: './recommend-book.component.html',
  styleUrls: ['./recommend-book.component.scss']
})
export class RecommendBookComponent implements OnInit, OnDestroy {

  // Time for loading component parts
  private static TIME_LOADING_TABLE: number = 300 + Math.random() * 600;
  private static TIME_LOADING_OVERLAY: number = 200;
  private static TIME_HIDING_CONTENT: number = 200 + Math.random() * 200;
  private static TIME_SUBMITTING_RECOMMENDATIONS: number = 500 + Math.random() * 400;

  @ViewChild('searchbox') searchbox: ElementRef;

  faCircleONotch: IconDefinition = faCircleNotch;
  faBookmark: IconDefinition = faBookmark;
  faTimes: IconDefinition = faTimesCircle;
  faStar: IconDefinition = faStar;
  faSearch: IconDefinition = faSearch;
  faCheck: IconDefinition = faCheckCircleEmpty;
  faCheckCircleFull: IconDefinition = faCheckDouble;
  faQuestionMark: IconDefinition = faQuestionCircle;
  faSuccessfulIcon: IconDefinition;

  isModalDismissable: boolean;
  confirmButtonDisabled: boolean;
  isContentVisible: boolean;
  inShowing: boolean;
  inHiding: boolean;
  isShowing: boolean;
  isSponsored: boolean;
  showSuccessfulMessage: boolean;
  successfulMessage: string;
  showDeleteModal: boolean;
  showDeleteModalContent: boolean;
  closeMessageCallback: () => void;

  bookInstance: Book;
  recommendationList: BookRecommendationUserList[] | null;  
  changedRecommendationList: BookRecommendationUserList[];
  searchEvent: Subject<string>;  

  // View properties
  viewTitle: string;
  viewAuthor: string;
  viewRecommendationNumber: number;  
  viewSelectedRecommendations: number;
  showTemporaryLoader: boolean;
  successfulMessageStartTransition: boolean;
  successfulMessageTimeout: number;

  // Subscription for modal communication
  private modalEventSubscription: Subscription; 
  private onRecommendationDeleteInit: Subscription;
  private onRecommendationDelete: Subscription; 

  constructor(
    private service: RecommendBookService    
  ) { 
    this.viewRecommendationNumber = 0;
    this.viewSelectedRecommendations = 0;
    this.confirmButtonDisabled = true;
    this.isContentVisible = false;
    this.recommendationList = null;   
    this.searchEvent = new Subject<string>();   
    this.isModalDismissable = true;
    this.showDeleteModalContent = false;
  }

  ngOnInit(): void {        
    this.modalEventSubscription = this.service.getModalEvent().subscribe((obj: {book: Book, operation: string}) => {
      if ( obj.operation === "open" ) {        
        this.bookInstance = obj.book;        
        this.showModal();
      }
    });

    // On recommendation delete init.
    this.onRecommendationDeleteInit = this.service.getOnRecommendationDeleteInit().subscribe((x: {book: Book, forUser: User}) => {         
      this.showDeleteModal = true;
      this.showDeleteModalContent = true;
      this.isModalDismissable = false;
    });
    
  }

  ngOnDestroy(): void {
      this.modalEventSubscription.unsubscribe();
      this.onRecommendationDeleteInit.unsubscribe();
      window.clearTimeout(this.successfulMessageTimeout);
  }

  private showModal(): void {

    // Init all values here.
    this.showTemporaryLoader = false;
    this.isModalDismissable = true;
    this.confirmButtonDisabled = true;
    this.showSuccessfulMessage = false;
    this.showDeleteModal = false;
    this.showDeleteModalContent = false;
    this.viewSelectedRecommendations = 0;
    this.searchbox.nativeElement.value = "";
    this.inShowing = true;
    this.isSponsored = false;
    this.successfulMessageStartTransition = false;

    // Notify subscribers of 'onInit' event.
    this.service.getModalOnInit().emit(this.bookInstance);

    // Notify subscribers of 'onShowing' event.
    this.service.getModalOnShowing().emit();

    this.loadOverlay().then(() => {      
      this.isShowing = true;
      this.inShowing = false;    

      return this.initiateRecommendTable();        
    }).then((data: BookRecommendationUserList[]) => {
      
      this.recommendationList = data;   
      this.viewRecommendationNumber = BookRecommendationController.getSentRecommendationNumberFor(this.bookInstance);               

      // Content is successfully loaded!
      this.refreshView();
      
      // Notify subscribers of 'onShow' event.
      this.service.getModalOnShow().emit();

      this.isContentVisible = true;     
    });
  }

  changedRecommendationsNumber(recomm: BookRecommendationUserList[]) {
    this.viewSelectedRecommendations = recomm.length;
    this.confirmButtonDisabled = recomm.length === 0;
    this.changedRecommendationList = recomm;
  }

  // On button click events
  onClick( evType: string, event: MouseEvent ): void {
    if ( !this.isContentVisible || !this.isShowing || !this.isModalDismissable )
      return;
    if ( evType === "decline" ) {

      this.declineModal();

    } else if ( evType === "confirm" ) {

      this.isModalDismissable = false;
      this.showTemporaryLoader = true;
      this.submitRecommendations().then(() => {
        // Display success dialog
        this.previewSuccessfulMessage(`Uspešno ste poslali preporuk${ this.viewSelectedRecommendations > 1 ? 'e' : 'u' }`, 
            faCheckDouble, 
            false, () => {
              this.declineModal();
            });
      });

    }
  }

  closeMessage(): void {
    window.clearTimeout(this.successfulMessageTimeout);
    if ( this.closeMessageCallback !== null )
      this.closeMessageCallback();
  }
  
  search(event: any): void {                 
    this.searchEvent.next(event.target.value);    
  }

  @HostListener('document:keyup.Escape', ['$event']) 
  onEscape(event: KeyboardEvent): void {
    if ( this.isShowing && this.isContentVisible && this.isModalDismissable )
      this.declineModal();
  }

  confirmDeleteRecommendation(event: any): void {    
    this.showDeleteModalContent = false;
    this.service.execRecommendationDelete().then((x: {book: Book, forUser: UserBasicData} | null) => {
      this.showDeleteModal = false;         
      this.service.getOnRecommendationDelete().emit(x);   
      this.viewRecommendationNumber = BookRecommendationController.getSentRecommendationNumberFor(this.bookInstance);
      this.previewSuccessfulMessage("Uspešno ste obrisali preporuku", faTrashAlt, false, () => {
        this.hideSuccessfulMessage();
      });
    });
  }

  declineDeleteRecommendation(event: MouseEvent): void {
    this.showDeleteModal = false;
    this.showDeleteModalContent = false;
    this.isModalDismissable = true;
  }

  hideSuccessfulMessage(): void {
    this.showTemporaryLoader = false;
    this.showSuccessfulMessage = false;
    this.isModalDismissable = true;
    window.clearTimeout(this.successfulMessageTimeout);
  }

  previewSuccessfulMessage(message: string, icon: IconDefinition, lazyLoading: boolean, callback: () => void): void {  
    if ( !lazyLoading ) {
      this.showTemporaryLoader = true;  
      this.showSuccessfulMessage = true;  
      this.successfulMessageStartTransition = true;
      this.isModalDismissable = true;
      this.successfulMessage = message;   
      this.faSuccessfulIcon = icon; 
      this.closeMessageCallback = callback;

      this.successfulMessageTimeout = window.setTimeout(() => {
        callback();
      }, 5000);
    } else {
      // In lazy loading style
    };
  }

  private loadOverlay(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, RecommendBookComponent.TIME_LOADING_OVERLAY);
    });
  }

  private unloadOverlay(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, RecommendBookComponent.TIME_LOADING_OVERLAY);
    });
  }

  private initiateRecommendTable(): Promise<BookRecommendationUserList[]> {
    return new Promise<BookRecommendationUserList[]>((resolve, reject) => {
      // Fetch data from server...
      // Populate table with user and it's recommendations

      setTimeout(() => {        
        let buyers: Buyer[] = UserDataManipulation.getAllBuyersExceptMe();
        let userList: BookRecommendationUserList[] = new Array<BookRecommendationUserList>();
        for( let i=0; i<buyers.length; i++ ) {
          userList.push({
            buyer: buyers[i],
            isRecommended: BookRecommendationController.isRecommended(this.bookInstance, buyers[i])
          });
        }        
        resolve(userList);
      }, RecommendBookComponent.TIME_LOADING_TABLE);
    });
  }

  private initiateShutdownModal(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.isContentVisible = false;

      // Notify subscribers about modal hiding process
      this.service.getModalOnHiding().emit();

      setTimeout(() => {
        resolve();
      }, RecommendBookComponent.TIME_HIDING_CONTENT);
    });
  }

  private submitRecommendations(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Submit selected recommendations to the server.         
      BookRecommendationController.addRecommendations(this.changedRecommendationList, this.bookInstance); 
      this.viewRecommendationNumber = BookRecommendationController.getSentRecommendationNumberFor(this.bookInstance);
      setTimeout(() => {
        resolve();
      }, RecommendBookComponent.TIME_SUBMITTING_RECOMMENDATIONS);
    });
  }

  private refreshView(): void {
    try {
      this.viewTitle = this.bookInstance.title;
      this.viewAuthor = this.bookInstance.author;   
      this.isSponsored = this.bookInstance.onPromotion;   
    } catch(e) {}    
  }

  private declineModal(): void {
    window.clearTimeout(this.successfulMessageTimeout);
    this.initiateShutdownModal().then(() => {
      this.inHiding = true;
      this.isShowing = false;
      return this.unloadOverlay();        
    }).then(() => {
      this.inHiding = false;

      // Notify subscribers that modal is hidden.
      this.service.getModalOnHidden().emit();
    });
  }

}
