import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';
import { AccountRecoveryComponent } from './account-recovery/account-recovery.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../shared/shared.module';
import { FlushLocalstorageComponent } from './flush-localstorage/flush-localstorage.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { RegisterFormBasicComponent } from './register/register-form-basic/register-form-basic.component';
import { RegisterFormLoginComponent } from './register/register-form-login/register-form-login.component';
import { RegisterFormFinishComponent } from './register/register-form-finish/register-form-finish.component';



@NgModule({
  declarations: [
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    AccountRecoveryComponent,
    FlushLocalstorageComponent,
    RegisterFormBasicComponent,
    RegisterFormLoginComponent,
    RegisterFormFinishComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    CoreRoutingModule,    
    MatInputModule,
    MatButtonModule,
    FontAwesomeModule               
  ]
})
export class CoreModule { }
