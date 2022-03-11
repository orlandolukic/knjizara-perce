import { trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faFlag, faSpinner, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { animationFadeInLeft, animationFadeInRight, animationFadeInY } from 'src/app/shared/animations/fade-in.animation';
import { BasicFinalResolver } from 'src/app/shared/resolvers/basic-final.resolver';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
    animationFadeInY
  ]
})
export class RegisterComponent implements OnInit {

  @ViewChild('name', {read: ElementRef, static: true}) inputName: ElementRef;

  faSpinner: IconDefinition = faSpinner;
  faFlag: IconDefinition = faFlag;

  isLoading: boolean;

  constructor(
    private resolver: BasicFinalResolver
  ) {     
    
  }

  ngOnInit(): void {
  }

}
