import { AfterViewChecked, AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { User } from 'data/users/user';
import { UserDataManipulation } from 'data/users/input.data';
import { faBook, faCaretDown, faCaretUp, faCog, faFileAlt, faHome, faSignOutAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { LoadService } from 'src/app/shared/services/load-service';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  profileImage: string;
  nameOfTheUser: string;
  accountType: string;
  faCaretDown: IconDefinition = faCaretDown;
  faFileAlt: IconDefinition = faFileAlt;
  faConfig: IconDefinition = faCog;
  faSignOut: IconDefinition = faSignOutAlt;
  faBook: IconDefinition = faBook;
  link: string;
  
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void { 
        
    let user: any = UserDataManipulation.getLoggedInUser();
    this.profileImage = user.image;
    this.nameOfTheUser = user.name + " " + user.surname;
    if ( user.type === User.BUYER ) {
      this.accountType = $localize `kupac`;
      this.link = "user";
    } else {
      this.accountType = $localize `prodavac`;
      this.link = "admin";
    }
  } 

  ngAfterViewInit(): void {
      //this.loadService.finishLoading();
  }

  

}
