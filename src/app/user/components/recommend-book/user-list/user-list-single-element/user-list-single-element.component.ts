import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { faCheckCircle as faCheckCircleEmpty } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle, faTrash, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Book } from 'data/book/book';
import { BookDataManipulation } from 'data/book/book-data-manipulation';
import { BookRecommendationUserList } from 'data/book/book-recommendation-user-list';
import { PathResolver } from 'data/path-resolver';
import { UserDataManipulation } from 'data/users/input.data';
import { User } from 'data/users/user';
import { UserBasicData } from 'data/users/user-basic-data';
import { Subscription } from 'rxjs';
import { RecommendBookService } from 'src/app/shared/services/modals/recommend-book-service';

@Component({
  selector: 'app-user-list-single-element',
  templateUrl: './user-list-single-element.component.html',
  styleUrls: ['./user-list-single-element.component.scss']
})
export class UserListSingleElementComponent implements OnInit, OnDestroy {

   // Icons
   faTrash: IconDefinition = faTrash;
   faCheckEmpty: IconDefinition = faCheckCircleEmpty;
   faCheckFull: IconDefinition = faCheckCircle;   

  @Input()
  set user( user: BookRecommendationUserList ) {
    this.isInitiallyRecommended = user.isRecommended;
    this.selectionIconChecked = user.isRecommended;
    this._user = user;
  }
  get user() { return this._user; }
  _user: BookRecommendationUserList;

  @Input('book')
  bookInstance: Book;

  @Output()
  clicked: EventEmitter<BookRecommendationUserList>;

  path: string = PathResolver.PROFILE_PICTURE_DIRECTORY;
  isInitiallyRecommended: boolean;
  selectionIconChecked: boolean;

  private subRecommendationDelete: Subscription;

  constructor(
    private modalService: RecommendBookService
  ) { 
    this.clicked = new EventEmitter<BookRecommendationUserList>();    
  }

  ngOnInit(): void {
    this.subRecommendationDelete = this.modalService.getOnRecommendationDelete().subscribe((value: {book: Book, forUser: UserBasicData}) => {
      if ( BookDataManipulation.areTheSame(this.bookInstance, value.book) && value.forUser.username === this.user.buyer.getUsername() ) {
        this.isInitiallyRecommended = false;
        this.selectionIconChecked = false;
        this.user.isRecommended = false;
      }
    });    
  }

  ngOnDestroy(): void {
     this.subRecommendationDelete.unsubscribe();
  }

  onClick(event: MouseEvent): void {
    if ( this.isInitiallyRecommended )
      return;
    this.user.isRecommended = !this.user.isRecommended;
    this.selectionIconChecked = !this.selectionIconChecked;
    this.clicked.emit(this.user);
  }

  deleteRecommendation(event: MouseEvent): void {    
    this.modalService.setRecommendationDeleteRequest({
      book: this.bookInstance,
      forUser: UserDataManipulation.getBasicUserDataFrom(this.user.buyer)
    });  
  }

}
