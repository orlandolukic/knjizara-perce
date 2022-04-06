import { trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { faCheck, faCheckCircle, faCheckDouble, faFlag, faSpinner, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { animationFadeInLeft, animationFadeInRight, animationFadeInY } from 'src/app/shared/animations/common.animation';
import { BasicFinalResolver } from 'src/app/shared/resolvers/basic-final.resolver';
import { TitleService } from 'src/app/shared/services/title-service';
import { sectionChangeAnimation } from './animations';
import { RegisterFormBasicComponent } from './register-form-basic/register-form-basic.component';
import { RegisterFormFinishComponent } from './register-form-finish/register-form-finish.component';
import { RegisterFormLoginComponent } from './register-form-login/register-form-login.component';
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
  @ViewChild('formFinish', {read: RegisterFormFinishComponent, static: true}) formFinish: RegisterFormFinishComponent;
  @ViewChild('formBasic', {read: RegisterFormBasicComponent, static: true}) formBasic: RegisterFormBasicComponent;
  @ViewChild('formLogin', {read: RegisterFormLoginComponent, static: true}) formLogin: RegisterFormLoginComponent;
  @ViewChild('registerFormPlaceholderContent', {read: ElementRef, static: true}) registerFormPlaceholderContent: ElementRef;

  @ViewChildren('form', {read: ElementRef}) forms: QueryList<ElementRef>;

  faSpinner: IconDefinition = faSpinner;
  faFlag: IconDefinition = faFlag;
  faCheck: IconDefinition = faCheck;
  faDoubleCheck: IconDefinition = faCheckCircle;

  isLoading: boolean; 
  showTasks: boolean;

  animations: any[];  

  doneAnimating(event: any) {        
    if ( event.fromState === "void" && event.toState === "start" ) {  

      this.activeSection = 0;
      this.showTasks = true;
      
      this.animations[0] = { value: 'sectionLoaded', params: {
        duration: 500,
        delay: 200,
        initTranslateX: -800,
        currentTranslateX: 0        
      } };
    }
  }

  constructor(
    private resolver: BasicFinalResolver,
    private titleService: TitleService,
    private cdr: ChangeDetectorRef
  ) {   
    super();  
    this.titleService.changeTitle($localize `Registracija`); 
    this.showTasks = false;  
    this.animations = [
      { value: "sectionNotLoaded" },
      { value: "sectionNotLoaded" },
      { value: "sectionNotLoaded" }
    ];         
  }  
  

  ngOnInit(): void {
    this.activeSection = -1;    

    this.tasks.push( this.formBasic );
    this.tasks.push( this.formLogin );
    this.tasks.push( this.formFinish );
    for( let i=0; i<this.tasks.length; i++) {
      this.tasks[i].setIndex(i);
    }
    
    this.activeTask = this.tasks[this.activeSection];  
  }

  ngAfterViewInit(): void {

    let width: number = this.registerFormPlaceholderContent.nativeElement.offsetWidth;
    this.registerFormPlaceholderContent.nativeElement.style.width = (width*3) + "px";
    this.forms.forEach((form) => {
      form.nativeElement.style.width = width + "px";
    });
  }

  onStateChange( task: SingleTask ) {
    let next: number = task.getIndex() + 1;
    /*
    this.animations[task.getIndex()] = { value: 'sectionLoaded', params: {
      duration: 500,
      delay: 200,
      initTranslateX: -800,
      currentTranslateX: 0        
    } };*/
    this.animations[next] = { value: 'sectionLoaded', params: {
      duration: 500,
      delay: 200,
      initTranslateX: -800,
      currentTranslateX: 0        
    } };    
  }

  onStageChange( index: number ): void {
    this.activeStage = index;    
  }

  onSectionChange( event: any, i: number ) {        
    if ( event.fromState === "sectionNotLoaded" && event.toState === "sectionLoaded" ) {      
      this.activeStage = 0;
      this.activeSection = i;
      this.tasks[this.activeSection].focusFirst();     
    }    
  }

  getStages(): string[] {
    if ( this.activeSection === -1 )
      return [""];
    return this.tasks[this.activeSection].getStages();
  }

  

}
