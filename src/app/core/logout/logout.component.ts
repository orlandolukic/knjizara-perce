import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDataManipulation } from 'data/users/input.data';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit, AfterViewInit {

  constructor(
    private rotuer: Router
  ) { }

  ngOnInit(): void {
    sessionStorage.removeItem("loggedInUser");
    UserDataManipulation.logout();
  }

  ngAfterViewInit(): void {
      this.rotuer.navigate(['login']);
  }



}
