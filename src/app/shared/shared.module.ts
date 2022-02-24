import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleService } from './services/title-service';
import { LoadService } from './services/load-service';
import { AccountSettingsComponent } from './components/account-settings/account-settings.component';
import { ChangeGeneralSettingsComponent } from './components/change-general-settings/change-general-settings.component';
import { ChangeUsernameComponent } from './components/change-username/change-username.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ButtonComponent } from './components/button/button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';
import { RecommendBookService } from './services/modals/recommend-book-service';
import { LoaderComponent } from './components/loader/loader.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoaderForBooksComponent } from './components/loader-for-books/loader-for-books.component';
import { ScrollUpComponent } from './components/scroll-up/scroll-up.component';
import { FinalResolver } from './utilities/final-resolver';
import { SponsoredStarComponent } from './components/sponsored-star/sponsored-star.component';
import { RecommendNumbersContentComponent } from './components/recommend-numbers-content/recommend-numbers-content.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { LoaderDeleteComponent } from './components/loader/loader-delete/loader-delete.component';
import { LoaderSuccessfulComponent } from './components/loader/loader-successful/loader-successful.component';



@NgModule({
  declarations: [
    AccountSettingsComponent,
    ChangeGeneralSettingsComponent,
    ChangeUsernameComponent,
    ChangePasswordComponent,
    ButtonComponent,
    LoaderComponent,
    FooterComponent,
    LoaderForBooksComponent,
    ScrollUpComponent,
    SponsoredStarComponent,
    RecommendNumbersContentComponent,
    UserDetailsComponent,
    LoaderDeleteComponent,
    LoaderSuccessfulComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    FontAwesomeModule
  ],
  exports: [
    ButtonComponent,
    LoaderComponent,
    LoaderForBooksComponent,
    FooterComponent,
    ScrollUpComponent,
    SponsoredStarComponent,
    RecommendNumbersContentComponent,
    UserDetailsComponent,
    LoaderDeleteComponent,
    LoaderSuccessfulComponent
  ],
  providers: [
    TitleService,    
    RecommendBookService    
  ]
})
export class SharedModule {
  
 }
