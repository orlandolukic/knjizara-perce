import { Component, OnInit } from '@angular/core';
import { SingleTask } from '../single-task';

@Component({
  selector: '[app-register-form-finish]',
  templateUrl: './register-form-finish.component.html',
  styleUrls: ['./register-form-finish.component.scss']
})
export class RegisterFormFinishComponent extends SingleTask implements OnInit {

  constructor() {
    super();
   }

  ngOnInit(): void {
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
