import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faChevronRight, faHome, faHomeUser, faSearch, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { SearchBook } from 'data/interfaces/search-book';
import { PathResolver } from 'data/path-resolver';
import { TitleService } from 'src/app/shared/services/title-service';

@Component({
  selector: 'app-all-books',
  templateUrl: './all-books.component.html',
  styleUrls: ['./all-books.component.scss']
})
export class AllBooksComponent implements OnInit {

  faHome: IconDefinition = faHomeUser;
  faChevronRight: IconDefinition = faChevronRight;
  faSearch: IconDefinition = faSearch;

  books: Array<number>;

  constructor(
    private titleService: TitleService,
    private router: Router
  ) { 
    this.titleService.changeTitle($localize `Sve knjige`);
  }

  ngOnInit(): void {
    this.books = [
      1, 2, 3
    ];
  }

  search(event: SearchBook): void {
    this.router.navigate([PathResolver.getUserURLPrefix() + 'search-books/' + event.searchedValue]);
  }

}
