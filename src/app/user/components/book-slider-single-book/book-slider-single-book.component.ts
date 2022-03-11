import { Component, EventEmitter, HostBinding, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { faBookmark, faBookOpen, faStar, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Book } from 'data/book/book';
import { BookRecommendationController } from 'data/book/recommendation/book-recommendation-controller';
import { PathResolver } from 'data/path-resolver';
import { Subscription } from 'rxjs';
import { RecommendBookService } from 'src/app/shared/services/modals/recommend-book-service';
import { bookSliderSingleBookAnimations } from './book-slider-single-book.animations';

@Component({
  selector: 'app-book-slider-single-book',
  templateUrl: './book-slider-single-book.component.html',
  styleUrls: ['./book-slider-single-book.component.scss'],
  animations: bookSliderSingleBookAnimations
})
export class BookSliderSingleBookComponent implements OnInit, OnDestroy {

  @Input() book: Book;
  @Output('recommend') recommend: EventEmitter<any>; 

  faStar: IconDefinition = faStar;
  faBookmark: IconDefinition = faBookmark;
  recommendationNumber: number;
  onRecommendModalHiding: Subscription;

  @Input()
  @HostBinding("@showBook") showBook: any;  
  
  @HostListener("@showBook.done", ['$event']) doneShowingAnimation(event: any): void {
    if ( event.toState === "animating" ) {
      if ( this.showBook.resolvePromise ) {
        this.showBook.resolvePromise();
      }
      this.showBook = "shown";          
    }
  }

  constructor(
    private modalService: RecommendBookService
  ) { 
    this.showBook = "start";    
    this.recommend = new EventEmitter<any>();   
    this.onRecommendModalHiding = this.modalService.getModalOnHiding().subscribe(() => {
      this.recommendationNumber = BookRecommendationController.getSentRecommendationNumberFor(this.book);
    });
  }

  ngOnInit(): void { 
    this.recommendationNumber = BookRecommendationController.getSentRecommendationNumberFor(this.book);
  }

  ngOnDestroy(): void {
      this.onRecommendModalHiding.unsubscribe();
  }

  goRecommendBook(): void {
    this.recommend.emit(this.book);
  }

  getBookLink(): string {
    return PathResolver.getPathForBook(this.book);
  }

}
