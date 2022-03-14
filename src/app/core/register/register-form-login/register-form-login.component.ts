import { Component, OnInit } from '@angular/core';
import { SingleTask } from '../single-task';

@Component({
  selector: '[app-register-form-login]',
  templateUrl: './register-form-login.component.html',
  styleUrls: ['./register-form-login.component.scss']
})
export class RegisterFormLoginComponent extends SingleTask implements OnInit {

  constructor() {
    super();
   }

  ngOnInit(): void {
  }

  verify(): boolean {
    return false;
  }

  getStages(): string[] {
    return ["E-mail", "Korisničko ime", "Lozinka"];
  }

  focusFirst(): void {
    
  }

}
