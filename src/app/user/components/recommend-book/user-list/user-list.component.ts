import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Book } from 'data/book/book';
import { BookRecommendation } from 'data/book/book-recommendation';
import { BookRecommendationUserList } from 'data/book/book-recommendation-user-list';
import { Buyer, User } from 'data/users/user';
import { Observable, Subscription } from 'rxjs';
import { RecommendBookService } from 'src/app/shared/services/modals/recommend-book-service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {

  @Input('users') 
  users: BookRecommendationUserList[] | null;

  @Input()
  search: Observable<string>;

  @Input('book')
  bookInstance: Book;

  @Output()
  changedNumberOfSelectedRecommendations: EventEmitter<BookRecommendationUserList[]>;

  selectedRecommendations: number;
  displayComponent: boolean;
  private subscriptionOnSearch: Subscription;
  private searchedValue: string;
  private subscriptionOnModalInit: Subscription;
  private selectedRecommendationsList: BookRecommendationUserList[];

  constructor(
    private modalService: RecommendBookService
  ) {         
    this.changedNumberOfSelectedRecommendations = new EventEmitter<BookRecommendationUserList[]>();  
    
    // Event 'onModalInit' which is used to inialize all user-list component.
    this.subscriptionOnModalInit = this.modalService.getModalOnInit().subscribe(() => {
      this.initComp();
    });  
  }

  private initComp(): void {
    this.selectedRecommendations = 0;  
    this.searchedValue = "";  
    this.selectedRecommendationsList = [];
  }

  ngOnInit(): void {
    this.subscriptionOnSearch = this.search.subscribe((searchedValue: string) => {      
      this.searchedValue = searchedValue.toLowerCase();
    });
  }

  ngOnDestroy(): void {
      this.subscriptionOnSearch.unsubscribe();
      this.subscriptionOnModalInit.unsubscribe();
  }

  private removeFromSelectedRecommendations(user: BookRecommendationUserList): void {
    this.selectedRecommendationsList = this.selectedRecommendationsList
      .filter((elem: BookRecommendationUserList, index: number, arr: BookRecommendationUserList[]) => {
      if ( User.theSameUser(user.buyer, elem.buyer) )
        return false;
      return true;
    });
  }

  private insertIntoSelectedRecommendations(user: BookRecommendationUserList): void {
    this.selectedRecommendationsList.push(user);
  }

  onUserListClicked(user: BookRecommendationUserList): void {
    if ( user.isRecommended ) {
      this.insertIntoSelectedRecommendations(user);
      this.selectedRecommendations++;
    } else {
      this.removeFromSelectedRecommendations(user);
      this.selectedRecommendations--;
    }
    this.changedNumberOfSelectedRecommendations.emit(this.selectedRecommendationsList);
  }

  shouldPreviewElement(bookr: BookRecommendationUserList): boolean {
    if ( this.searchedValue === "" )
      return true;
    let fullname: string = bookr.buyer.getFullName().toLowerCase();
    return fullname.indexOf(this.searchedValue) > -1    
  }

}
