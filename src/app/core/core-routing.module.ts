import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnloggedSectionGuard } from 'src/app/shared/guards/unlogged-section-guard';
import { UserSectionGuard } from 'src/app/shared/guards/user-section-guard';
import { AccountRecoveryComponent } from './account-recovery/account-recovery.component';
import { FlushLocalstorageComponent } from './flush-localstorage/flush-localstorage.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [  
  { path: 'login', component: LoginComponent, canActivate: [ UnloggedSectionGuard ] },    
  { path: 'register', component: RegisterComponent, canActivate: [ UnloggedSectionGuard ] },
  { path: 'forgot-password', component: AccountRecoveryComponent, canActivate: [ UnloggedSectionGuard ] },
  { path: 'logout', component: LogoutComponent },
  { path: 'flush-storage', component: FlushLocalstorageComponent },
  { path: '**', component: LoginComponent, canActivate: [UnloggedSectionGuard, UserSectionGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
