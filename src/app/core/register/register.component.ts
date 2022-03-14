import { trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faCheck, faCheckCircle, faCheckDouble, faFlag, faSpinner, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { animationFadeInLeft, animationFadeInRight, animationFadeInY } from 'src/app/shared/animations/fade-in.animation';
import { BasicFinalResolver } from 'src/app/shared/resolvers/basic-final.resolver';
import { TitleService } from 'src/app/shared/services/title-service';
import { RegisterFormBasicComponent } from './register-form-basic/register-form-basic.component';
import { RegisterFormFinishComponent } from './register-form-finish/register-form-finish.component';
import { RegisterFormLoginComponent } from './register-form-login/register-form-login.component';
import { RegisterTasks, SingleTask } from './single-task';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
    animationFadeInY
  ]
})
export class RegisterComponent extends RegisterTasks implements OnInit, AfterViewInit {

  @ViewChild('name', {read: ElementRef, static: true}) inputName: ElementRef;
  @ViewChild('formFinish', {read: RegisterFormFinishComponent, static: true}) formFinish: RegisterFormFinishComponent;
  @ViewChild('formBasic', {read: RegisterFormBasicComponent, static: true}) formBasic: RegisterFormBasicComponent;
  @ViewChild('formLogin', {read: RegisterFormLoginComponent, static: true}) formLogin: RegisterFormLoginComponent;
  @ViewChild('registerFormPlaceholderContent', {read: ElementRef, static: true}) registerFormPlaceholderContent: ElementRef;

  faSpinner: IconDefinition = faSpinner;
  faFlag: IconDefinition = faFlag;
  faCheck: IconDefinition = faCheck;
  faDoubleCheck: IconDefinition = faCheckCircle;

  isLoading: boolean; 
  showTasks: boolean;  

  constructor(
    private resolver: BasicFinalResolver,
    private titleService: TitleService
  ) {   
    super();  
    this.titleService.changeTitle("Registracija"); 
    this.showTasks = false;    
  }  
  

  ngOnInit(): void {
    this.activeSection = 0;    

    this.tasks.push( this.formBasic );
    this.tasks.push( this.formLogin );
    this.tasks.push( this.formFinish );
    
    this.activeTask = this.tasks[this.activeSection];
    this.showTasks = true;
  }

  ngAfterViewInit(): void {

    let width: number = this.registerFormPlaceholderContent.nativeElement.offsetWidth;
    this.registerFormPlaceholderContent.nativeElement.style.width = (width*3) + "px";

    // Focus first element inside the section
    this.tasks[this.activeSection].focusFirst();    
  }

  onStateChange( task: SingleTask, changedIndex: number ) {
    console.log(task);
    console.log(changedIndex);
  }

  

}
