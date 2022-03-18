import { Component, ElementRef, OnInit } from '@angular/core';
import { SingleTask } from '../single-task';

@Component({
  selector: '[app-register-form-finish]',
  templateUrl: './register-form-finish.component.html',
  styleUrls: ['./register-form-finish.component.scss']
})
export class RegisterFormFinishComponent extends SingleTask implements OnInit {

  constructor(
    host: ElementRef
  ) {
    super(0, host);
   }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  verify(): boolean {
    throw new Error('Method not implemented.');
  }

  getStages(): string[] {
    return [];
  }

  focusFirst(): void {
    
  }
  
  initStartupAnimation(): void {
    
  }

}
