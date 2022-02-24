import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { faTrash, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Book } from 'data/book/book';
import { BookRecommendationController } from 'data/book/recommendation/book-recommendation-controller';
import { SingleRecommendation, SingleRecommendationDetails, SingleRecommendationToDelete } from 'data/interfaces/single-recommendation';
import { PathResolver } from 'data/path-resolver';
import { UserBasicData } from 'data/users/user-basic-data';

@Component({
  selector: 'div[app-single-recommendation]',
  templateUrl: './single-recommendation.component.html',
  styleUrls: ['./single-recommendation.component.scss']
})
export class SingleRecommendationComponent implements OnInit {

  faTrash: IconDefinition = faTrash;

  @Input()
  recommendation: SingleRecommendation;

  @Input()
  number: number;

  @Output()
  delete: EventEmitter<SingleRecommendationToDelete>;

  @ViewChild('recommendationsPlaceholder', {read: ElementRef, static: true}) 
  recommendationsPlaceholder: ElementRef;

  @ViewChildren('singleRecommendation') 
  singleRecommendations: QueryList<ElementRef>;

  recommendationNumber: number;

  constructor(
    public hostElement: ElementRef
  ) { 
    this.delete = new EventEmitter();
  }

  ngOnInit(): void {
    this.recommendationNumber = this.getRecommendationsNumber(this.recommendation.book!.id);
  }

  getUrl(s: string): string {
    return PathResolver.BOOK_PICTURE_DIRECTORY + s;
  }

  getRecommendationsNumber(id: number): number {
    return BookRecommendationController.getSentRecommendationNumberForId(id);
  }

  getPathForBook(book: Book | null): string {    
    return PathResolver.getPathForBook(book!);
  }

  refreshRecommendationNumber(): void {
    this.recommendationNumber = this.getRecommendationsNumber(this.recommendation.book!.id);
  }

  printDate(d: Date): string {
    let s: string = "";
    let date: Date = new Date(d);
    if ( date.getDate() < 10 )
      s += "0";
    s += date.getDate() + ".";
    if ( date.getMonth() + 1 < 10 ) 
      s += "0";
    s += (date.getMonth() + 1) + "." + date.getFullYear() + ".";
    return s;
  }

  printTime(d: Date): string {
    let s: string = "";
    let date: Date = new Date(d);
    if ( date.getHours() < 10 )
      s += "0";
    s += date.getHours() + ":";
    if ( date.getMinutes() < 10 )
      s += "0";
    s += date.getMinutes();
    return s;
  }

  deleteRecommendation(i: number, recommendation: SingleRecommendationDetails): void {    
    this.delete.emit({
      index: i,
      details: recommendation,
      htmlElement: this.singleRecommendations.get(i) 
    });
  }

}
