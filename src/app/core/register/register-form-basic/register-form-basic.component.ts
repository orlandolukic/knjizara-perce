import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SingleTask } from '../single-task';

@Component({
  selector: '[app-register-form-basic]',
  templateUrl: './register-form-basic.component.html',
  styleUrls: [
    './register-form-basic.component.scss', 
    '../form.scss'
  ]
})
export class RegisterFormBasicComponent extends SingleTask implements OnInit {

  @ViewChild("name", {read: ElementRef, static: true}) name: ElementRef;
  @ViewChild("surname", {read: ElementRef, static: true}) surname: ElementRef;
  @ViewChild("telephone", {read: ElementRef, static: true}) telephone: ElementRef;
  @ViewChild("address", {read: ElementRef, static: true}) address: ElementRef;

  constructor() {
    super();
   }

  ngOnInit(): void {
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

}
