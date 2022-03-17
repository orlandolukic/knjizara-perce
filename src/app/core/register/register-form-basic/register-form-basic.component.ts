import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { animationFadeInLeft } from 'src/app/shared/animations/common.animation';
import { stageChangeAnimation } from '../animations';
import { SingleTask } from '../single-task';

@Component({
  selector: '[app-register-form-basic]',
  templateUrl: './register-form-basic.component.html',
  styleUrls: [
    './register-form-basic.component.scss', 
    '../form.scss'
  ],
  animations: [
    stageChangeAnimation
  ]
})
export class RegisterFormBasicComponent extends SingleTask implements OnInit {

  @ViewChild("name", {read: ElementRef, static: true}) name: ElementRef;
  @ViewChild("surname", {read: ElementRef, static: true}) surname: ElementRef;
  @ViewChild("telephone", {read: ElementRef, static: true}) telephone: ElementRef;
  @ViewChild("address", {read: ElementRef, static: true}) address: ElementRef;

  animations: any[];  

  constructor() {
    super();    
  }

  ngOnInit(): void {    
    this.animations = [
      {value: 'stageLoaded'},
      {value: 'stageNotLoaded'},
    ];     
  }

  verify(): boolean {
    return true;
  }

  getStages(): string[] {
    return ["Ime i prezime", "Kontakt podaci", "Adresa"];
  }

  focusFirst(): void {
    this.name.nativeElement.focus();
  }

  @HostListener('@stageChange.done', ['$event', 'number'])
  doneAnimating(event: any, i: number) {
    console.log(i);
    console.log(event);
  }

  initStartupAnimation(): void {
    
  }

}
