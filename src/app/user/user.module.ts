import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DashboardComponent } from '../shared/components/dashboard/dashboard.component';
import { DashboardComponent as UserDashboardComponent } from '../user/dashboard/dashboard.component';
import { MainComponent } from './main/main.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BookSliderComponent } from './components/book-slider/book-slider.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { AllBooksComponent } from './all-books/all-books.component';
import { SearchBooksComponent } from './search-books/search-books.component';
import { BookSliderSingleBookComponent } from './components/book-slider-single-book/book-slider-single-book.component';
import { BookComponent } from './book/book.component';
import { RecommendBookComponent } from './components/recommend-book/recommend-book.component';
import { SharedModule } from '../shared/shared.module';
import { UserListComponent } from './components/recommend-book/user-list/user-list.component';
import { UserListSingleElementComponent } from './components/recommend-book/user-list/user-list-single-element/user-list-single-element.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { AllBooksListingComponent } from './components/all-books-listing/all-books-listing.component';
import { RecommendationsResolver } from './recommendations/recommendations-resolver';
import { SingleRecommendationComponent } from './recommendations/single-recommendation/single-recommendation.component';
import { AllBooksResolver } from './all-books/all-books-resolver';
import { FindBookResolver } from './book/find-book-resolver';
import { TraitComponent } from './book/trait/trait.component';
import { SingleCommentComponent } from './book/single-comment/single-comment.component';
import { CommentsSectionComponent } from './book/comments-section/comments-section.component';



@NgModule({
  declarations: [
    DashboardComponent,
    UserDashboardComponent,
    MainComponent,
    BookSliderComponent,
    RecommendationsComponent,
    AllBooksComponent,
    SearchBooksComponent,
    BookSliderSingleBookComponent,
    BookComponent,
    RecommendBookComponent,    
    UserListComponent, UserListSingleElementComponent, AllBooksListingComponent, SingleRecommendationComponent, TraitComponent, SingleCommentComponent, CommentsSectionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule,       
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    FontAwesomeModule  
  ],
  exports: [
    
  ],
  providers: [
    RecommendationsResolver,
    AllBooksResolver,
    FindBookResolver
  ]
})
export class UserModule { }
