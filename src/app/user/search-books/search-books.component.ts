import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, UrlSegment } from '@angular/router';
import { faChevronRight, faHomeUser, faSearch, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { SearchBook } from 'data/interfaces/search-book';
import { PathResolver } from 'data/path-resolver';
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
  searchedValue: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: TitleService
  ) {
    this.searchedValue = "";        
   }

  ngOnInit(): void {        
    this.route.params.forEach((v: Params) => {        
      if ( v['searchTerm'] ) {
        this.searchedValue = v['searchTerm'];        
        this.titleService.changeTitle("Pretraga knjige - " + this.searchedValue);
      }
    });    
  }

  search( searched: SearchBook ): void {
    this.router.navigate([PathResolver.getUserURLPrefix() + 'search-books/' + searched.searchedValue]);
    // Perform search...
    console.log("perform search");    
  }

}
