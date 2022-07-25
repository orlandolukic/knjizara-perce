import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { faCheck, faCheckCircle, faCheckDouble, faChevronRight, faFlag, faSpinner, faTimesCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { animationFadeInY } from 'src/app/shared/animations/common.animation';
import { BasicFinalResolver } from 'src/app/shared/resolvers/basic-final.resolver';
import { TitleService } from 'src/app/shared/services/title-service';
import { sectionChangeAnimation } from './animations';
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

  isLoading: boolean; 

  /**
   * Error indicators
   */
  errorName: string;
  isErrorName: boolean;

  doneAnimating(event: any) {        
    this.inputName.nativeElement.focus();
  }

  constructor(
    private resolver: BasicFinalResolver,
    private titleService: TitleService,
    private cdr: ChangeDetectorRef
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

  

}
