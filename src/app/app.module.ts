import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserSectionGuard } from 'src/app/shared/guards/user-section-guard';
import { UnloggedSectionGuard } from 'src/app/shared/guards/unlogged-section-guard';
import { AdminSectionGuard } from 'src/app/shared/guards/admin-section-guard';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent     
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    FontAwesomeModule    
  ],
  providers: [
    UserSectionGuard,
    UnloggedSectionGuard,
    AdminSectionGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
