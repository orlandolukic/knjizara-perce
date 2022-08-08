import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { faCheck, faCheckCircle, faCheckDouble, faChevronRight, faCircleNotch, faFlag, faHourglassHalf, faSpinner, faTimesCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { NotifierService } from 'angular-notifier';
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

  isLoading: boolean; 
  errors: number;

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
  successMessage: string;
  lastEnteredUsername: string;

  doneAnimating(event: any) {        
    this.inputName.nativeElement.focus();
  }

  constructor(
    private resolver: BasicFinalResolver,
    private titleService: TitleService,
    private cdr: ChangeDetectorRef,
    private notifier: NotifierService
  ) {   
    super();  
    this.titleService.changeTitle($localize `Registracija`);   
  }  
  

  ngOnInit(): void {
    
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

  validate( inputField: HTMLInputElement ): void {

    if ( !checkRegisterRequest(this, inputField) )
      return;

    if ( inputField.name === "username" ) {
      if ( this.lastEnteredUsername === inputField.value )
        return;
      this.disabledUsername = true;
      this.isOkUsername = false;
      this.lastEnteredUsername = inputField.value;
      new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      }).finally(() => {
        this.disabledUsername = false;
        this.isOkUsername = true;
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
    this.notifier.show({
      type: 'error',
      message: 'You are awesome! I mean it!'      
    });
  }


  

}
