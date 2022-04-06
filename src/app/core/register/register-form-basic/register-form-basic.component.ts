import { AfterViewInit, Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { animationFadeInLeft } from 'src/app/shared/animations/common.animation';
import { stageChangeAnimation } from '../animations';
import { SingleTask } from '../single-task';

@Component({
  selector: '[app-register-form-basic]',
  templateUrl: './register-form-basic.component.html',
  styleUrls: [
    './register-form-basic.component.scss', 
    '../form.scss'
  ]
})
export class RegisterFormBasicComponent extends SingleTask implements AfterViewInit {

  @ViewChild("name", {read: ElementRef, static: true}) name: ElementRef;
  @ViewChild("surname", {read: ElementRef, static: true}) surname: ElementRef;
  @ViewChild("telephone", {read: ElementRef, static: true}) telephone: ElementRef;
  @ViewChild("address", {read: ElementRef, static: true}) address: ElementRef; 

  constructor(
    host: ElementRef
  ) {
    super(3, host);    
  }

  override ngOnInit(): void {    
    super.ngOnInit();    
  }

  ngAfterViewInit(): void {

  }

  verify(): boolean {
    return true;
  }

  getStages(): string[] {
    return [$localize `Ime i prezime`, $localize `Kontakt podaci`, $localize `Adresa`];
  }

  focusFirst(): void {    
    if ( this.currentStage === 0 )
      this.name.nativeElement.focus();
    else
      this.telephone.nativeElement.focus();
  }

  initStartupAnimation(): void {
    
  }

}
