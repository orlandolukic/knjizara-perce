import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { faCheck, faCheckCircle, faCheckDouble, faChevronRight, faCircleNotch, faFlag, faHourglassHalf, faSpinner, faTimes, faTimesCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { NotifierService } from 'angular-notifier';
import { UserDataManipulation } from 'data/users/input.data';
import { animationFadeInY } from 'src/app/shared/animations/common.animation';
import { BasicFinalResolver } from 'src/app/shared/resolvers/basic-final.resolver';
import { TitleService } from 'src/app/shared/services/title-service';
import { sectionChangeAnimation } from './animations';
import { checkRegisterRequest } from './register-utils';
import { RegisterTasks, SingleTask } from './single-task';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
    animationFadeInY,
    sectionChangeAnimation
  ]
})
export class RegisterComponent extends RegisterTasks implements OnInit, AfterViewInit {

  @ViewChild('name', {read: ElementRef, static: true}) inputName: ElementRef;
  @ViewChild('surname', {read: ElementRef, static: true}) inputSurname: ElementRef;
  @ViewChild('contact', {read: ElementRef, static: true}) inputContact: ElementRef;
  @ViewChild('address', {read: ElementRef, static: true}) inputAddress: ElementRef;
  @ViewChild('email', {read: ElementRef, static: true}) inputEmail: ElementRef;
  @ViewChild('username', {read: ElementRef, static: true}) inputUsername: ElementRef;
  @ViewChild('password', {read: ElementRef, static: true}) inputPassword: ElementRef;
  @ViewChild('passwordConfirm', {read: ElementRef, static: true}) inputPasswordConfirm: ElementRef;

  faSpinner: IconDefinition = faSpinner;
  faFlag: IconDefinition = faFlag;
  faCheck: IconDefinition = faCheck;
  faCheckCircle: IconDefinition = faCheckCircle;
  faDoubleCheck: IconDefinition = faCheckCircle;
  faChevronRight: IconDefinition = faChevronRight;
  faTimesCircle: IconDefinition = faTimesCircle;
  faHourglassHalf: IconDefinition = faHourglassHalf;
  faCircleONotch: IconDefinition = faCircleNotch;
  faTimes: IconDefinition = faTimes;

  isLoading: boolean; 
  errors: number;
  isFormDisabled: boolean;
  firstErrorElement: HTMLInputElement | null;

  /**
   * Error indicators
   */
  errorName: string;
  errorSurname: string;
  errorContact: string;
  errorAddress: string;
  errorEmail: string;
  errorUsername: string;
  errorPassword: string | null;
  errorPasswordCapitalLetter: boolean;
  errorPasswordNumber: boolean;
  errorPasswordSpecialChar: boolean;
  errorPasswordConfirm: string;

  isErrorName: boolean;
  isErrorSurname: boolean;
  isErrorContact: boolean;
  isErrorAddress: boolean;
  isErrorEmail: boolean;
  isErrorUsername: boolean;
  isErrorPassword: boolean;
  isErrorPasswordConfirm: boolean;  

  disabledUsername: boolean;
  isOkUsername: boolean;
  isTakenUsername: boolean;
  successMessage: string;
  lastEnteredUsername: string;

  doneAnimating(event: any) {        
    this.inputName.nativeElement.focus();
  }

  constructor(
    private resolver: BasicFinalResolver,
    private titleService: TitleService,
    private cdr: ChangeDetectorRef,
    private notifier: NotifierService,
    private router: Router
  ) {   
    super();  
    this.titleService.changeTitle($localize `Registracija`);   
  }  
  

  ngOnInit(): void {
    this.errors = 0;
    this.firstErrorElement = null;
  }

  ngAfterViewInit(): void {
    
  }

  onStateChange( task: SingleTask ) {
    
  }

  onStageChange( index: number ): void {
    this.activeStage = index;    
  }

  onSectionChange( event: any, i: number ) {        
    
  }

  getStages(): string[] {
    if ( this.activeSection === -1 )
      return [""];
    return this.tasks[this.activeSection].getStages();
  }

  clearFirstErrorElement(): void {
    this.firstErrorElement = null;
  }

  validate( inputField: HTMLInputElement, focusFirst: boolean = false ): void {

    if ( !checkRegisterRequest(this, inputField) ) {
      if ( focusFirst && this.firstErrorElement === null ) {
        this.firstErrorElement = inputField;
        this.firstErrorElement.focus();
      }
      return;
    }

    if ( inputField.name === "username" ) {
      if ( this.lastEnteredUsername === inputField.value )
        return;      
      this.disabledUsername = true;
      this.isOkUsername = false; 
      this.isTakenUsername = false;     
      this.lastEnteredUsername = inputField.value;
      new Promise<boolean>((resolve) => {        
        setTimeout(() => {          
          resolve( UserDataManipulation.hasUsername(inputField.value) );
        }, 750 + Math.random() * 500);
      }).then((hasUsername) => {
        this.disabledUsername = false;
        this.isOkUsername = !hasUsername;
        this.isTakenUsername = hasUsername;
      });
    };
  }

  addUpError(): void {
    this.errors++;
  }

  removeDownError() : void {
    this.errors--;
  }

  clearAllErrors(): void {
    this.errors = 0;
  }

  getErrorNumber(): number {
    return this.errors;
  }

  register(): void {    

    this.clearFirstErrorElement();    
    this.validate(this.inputName.nativeElement, true);
    this.validate(this.inputSurname.nativeElement, true);
    this.validate(this.inputContact.nativeElement, true);
    this.validate(this.inputAddress.nativeElement, true);
    this.validate(this.inputEmail.nativeElement, true);
    this.validate(this.inputUsername.nativeElement, true);
    this.validate(this.inputPassword.nativeElement, true);
    this.validate(this.inputPasswordConfirm.nativeElement, true);   

    console.log(this.errors);
    if ( this.errors > 0 )
      this.notifier.show({
        type: 'error',
        message: $localize `Dogodile su se greške prilikom unosa. Molimo proverite formu.`      
      });
    else {
      // Perform registration of new user           
      this.isFormDisabled = true;
      UserDataManipulation.registerNewUser(
        this.inputName.nativeElement.value,
        this.inputSurname.nativeElement.value,
        this.inputContact.nativeElement.value,
        this.inputAddress.nativeElement.value,
        this.inputEmail.nativeElement.value,
        this.inputUsername.nativeElement.value,
        this.inputPassword.nativeElement.value
      ).then(() => {        
        this.router.navigate(['user']);
      });
    }
  }


  

}
