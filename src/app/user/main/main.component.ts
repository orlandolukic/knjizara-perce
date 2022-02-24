import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faBook, faFileAlt, faGrinStars, faSearch, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { BookRecommendationController } from 'data/book/recommendation/book-recommendation-controller';
import { SearchBook } from 'data/interfaces/search-book';
import { PathResolver } from 'data/path-resolver';
import { TitleService } from 'src/app/shared/services/title-service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  faFileAlt: IconDefinition = faFileAlt;
  faSearch: IconDefinition = faSearch;
  faBook: IconDefinition = faBook;
  faFaceGrinStars: IconDefinition = faGrinStars;  

  myRecommendationsNumber: number;

  constructor(
    private titleService: TitleService,
    private router: Router
  ) { 
    this.myRecommendationsNumber = 0;
    this.titleService.changeTitle("");
  }

  ngOnInit(): void {
    this.myRecommendationsNumber = BookRecommendationController.getAllRecommendationsForUser().length;
  }

  search(searched: SearchBook): void {        
    this.router.navigate([PathResolver.getUserURLPrefix() + "search-books/" + searched.searchedValue]);
  }

}
