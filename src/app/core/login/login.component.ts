import { KeyValuePipe } from '@angular/common';
import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { faHome, faSignInAlt, faSpinner, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { User } from 'data/users/user';
import { UserDataManipulation } from 'data/users/input.data';
import { LoadService } from 'src/app/shared/services/load-service';
import { TitleService } from 'src/app/shared/services/title-service';
import { sha256 } from 'js-sha256';
import { animationFadeInLeft, animationFadeInRight } from 'src/app/shared/animations/common.animation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],  
  encapsulation: ViewEncapsulation.Emulated,
  animations: [
    animationFadeInLeft,
    animationFadeInRight
  ]
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('loginButton')  loginButton: MatButton;
  @ViewChild('username') username: ElementRef;
  @ViewChild('password') password: ElementRef;

  faHome = faHome;
  faSignInAlt = faSignInAlt;
  faTimesCircle = faTimesCircle;
  faSpinner = faSpinner;
  errorVisible: boolean = false;
  text: string = "Not visible ATM";
  private timeout: any;
  isLoading: boolean = false;

  constructor(
    private titleService: TitleService,
    private router: Router,
    private route: ActivatedRoute,    
  ) { 
    
  }

  ngOnInit(): void {
    this.titleService.changeTitle($localize `Prijava na sistem`);    
  }

  ngOnDestroy(): void {
    window.clearTimeout(this.timeout);
  }

  ngAfterViewInit(): void {
    this.username.nativeElement.focus();   
  }

  login(): void {
    let username: string = this.username.nativeElement.value;
    let password: string = this.password.nativeElement.value;
    this.hideErrorMessage();    

    if ( username === "" || password === "" ) {
      this.showErrorMessage($localize `Korisničko ime i/ili lozinka su prazni. Molimo pokušajte ponovo`);
      return;
    }

    let promiseLogin: Promise<any> = new Promise<any>((resolve, reject) => {            
      this.loginButton.disabled = true;
      this.username.nativeElement.disabled = true;
      this.password.nativeElement.disabled = true;
      this.isLoading = true;
      
      setTimeout(() => {
        if ( UserDataManipulation.isUserPresent( username, sha256(password) ) ) {          
            let user: any = UserDataManipulation.getUserByUsername(username);            
            resolve(user);
          } else {
            reject();
          }
      }, 300 + Math.random() * 2000);              
    });

    promiseLogin.then((user: any) => {
            
      UserDataManipulation.logInUser(user);      
      sessionStorage.setItem("loggedInUser", JSON.stringify(user));
      if ( user.type === User.BUYER ) {             
        this.router.navigate(['user']);
        return;
      } else
        this.router.navigate(['admin']);

    }).catch((reason: any) => {
      this.showErrorMessage($localize `Korisničko ime i/ili lozinka nisu ispravno unešeni. Molimo pokušajte ponovo`);      
      this.username.nativeElement.value = "";
      this.password.nativeElement.value = "";
    }).finally(() => {
      this.loginButton.disabled = false;
      this.username.nativeElement.disabled = false;
      this.password.nativeElement.disabled = false;
      this.username.nativeElement.focus();
      this.isLoading = false;
    });
  }

  private showErrorMessage(mssg: string): void {
    this.text = mssg;
    this.errorVisible = true;
    this.username.nativeElement.focus();
    window.clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.errorVisible = false;
    }, 5000);
  }

  private hideErrorMessage(): void {
    window.clearTimeout(this.timeout);
    this.errorVisible = false;
  }

  keyup(field: string, event: KeyboardEvent ): void {
    if ( event.key === "Enter" ) {
      if ( field === "username" )
        this.password.nativeElement.focus();
      else {
        this.login();
      }
    }
  }



}
