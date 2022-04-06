import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router, UrlSegment } from '@angular/router';
import { faChevronRight, faCircleNotch, faHomeUser, faSearch, faSpinner, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { SearchBook } from 'data/interfaces/search-book';
import { PathResolver } from 'data/path-resolver';
import { SearchBookComponent } from 'src/app/shared/components/search-book/search-book.component';
import { TitleService } from 'src/app/shared/services/title-service';

@Component({
  selector: 'app-search-books',
  templateUrl: './search-books.component.html',
  styleUrls: ['./search-books.component.scss']
})
export class SearchBooksComponent implements OnInit {

  faHome: IconDefinition = faHomeUser;
  faChevronRight: IconDefinition = faChevronRight;
  faSearch: IconDefinition = faSearch;
  faSpinner: IconDefinition = faCircleNotch;

  searchedValue: string;
  resultsFound: number;
  inSearch: boolean;
  isResetted: boolean;
  lastSearched: string;

  @ViewChild('searchBook', {read: SearchBookComponent, static: true})
  searchBook: SearchBookComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: TitleService
  ) {
    this.searchedValue = "";        
    this.resultsFound = 0;
    this.inSearch = true;    
   }

  ngOnInit(): void {                
    this.lastSearched = "";
    this.route.params.forEach((v: Params) => {        
      if ( v['searchTerm'] ) {
        this.searchedValue = v['searchTerm'];        
        this.lastSearched = this.searchedValue;
        this.titleService.changeTitle($localize `:@@bookSearchTitle:Pretraga knjige - ${this.searchedValue}`);
      }
    });    
  }

  search( searched: SearchBook ): void {    
  
    if ( searched.searchedValue !== this.lastSearched ) {      
      this.router.navigate([PathResolver.getUserURLPrefix() + 'search-books/' + searched.searchedValue]);
      this.searchedValue = searched.searchedValue; 
      this.inSearch = true;      
      this.lastSearched = searched.searchedValue;
    };
    
  }

  booksFound(n: number): void {
    this.resultsFound = n;
    this.inSearch = false;   
    this.searchBook.focus(); 
  }

}
