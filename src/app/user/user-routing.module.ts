import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSectionGuard } from 'src/app/shared/guards/user-section-guard';
import { AccountSettingsComponent } from '../shared/components/account-settings/account-settings.component';
import { ChangeGeneralSettingsComponent } from '../shared/components/change-general-settings/change-general-settings.component';
import { ChangePasswordComponent } from '../shared/components/change-password/change-password.component';
import { ChangeUsernameComponent } from '../shared/components/change-username/change-username.component';
import { BookComponent } from './book/book.component';
import { DashboardComponent } from '../shared/components/dashboard/dashboard.component';
import { DashboardComponent as UserDashboardComponent } from '../user/dashboard/dashboard.component';
import { MainComponent } from './main/main.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { SearchBooksComponent } from './search-books/search-books.component';
import { AllBooksComponent } from './all-books/all-books.component';
import { RecommendationsResolver } from './recommendations/recommendations-resolver';
import { FinalResolver } from '../shared/utilities/final-resolver';
import { AllBooksResolver } from './all-books/all-books-resolver';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [ UserSectionGuard ],
    children: [
      {
        path: '',
        component: UserDashboardComponent,
        children: [
          {
            path: '',
            component: MainComponent
          },
          {
            path: 'my-recommendations',
            component: RecommendationsComponent,
            resolve: {
              jobX: RecommendationsResolver             
            }
          },
          {
            path: 'all-books',
            component: AllBooksComponent,
            resolve: {
              start: AllBooksResolver
            }    
          },
          {
            path: 'book/:id',
            component: BookComponent        
          },
          {
            path: 'search-books',
            component: SearchBooksComponent
          },
          {
            path: 'search-books/:searchTerm',
            component: SearchBooksComponent
          },
          {
            path: 'settings',
            component: AccountSettingsComponent,
            children: [
              {
                path: 'change-general-data',
                component: ChangeGeneralSettingsComponent
              },
              {
                path: 'change-username',
                component: ChangeUsernameComponent
              },
              {
                path: 'change-password',
                component: ChangePasswordComponent
              }
            ]
          }
        ]
      }      
    ]
  }
];

@NgModule({  
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
