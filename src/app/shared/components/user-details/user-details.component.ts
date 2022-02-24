import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PathResolver } from 'data/path-resolver';
import { User } from 'data/users/user';
import { UserBasicData } from 'data/users/user-basic-data';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit, AfterViewInit {

  private static PATH_TO_IMAGES: string = PathResolver.PROFILE_PICTURE_DIRECTORY;

  @Input()
  user: User | UserBasicData;

  @Input()
  lightenUsername?: number;

  @ViewChild('username', {static: true}) username: ElementRef;

  constructor() { 
    this.lightenUsername = 0;
  }

  ngOnInit(): void {    
  }

  ngAfterViewInit(): void {
      this.username.nativeElement.style = "opacity: " + (1 - this.lightenUsername!);
  }

  getUserPictureURL(): string {
    if ( this.user instanceof User ) {
      return UserDetailsComponent.PATH_TO_IMAGES + this.user.getImage();      
    } else {
      return UserDetailsComponent.PATH_TO_IMAGES + this.user.image;
    }
  }

  getFullName(): string {
    if ( this.user instanceof User ) {
      return this.user.getFullName();      
    } else {
      return this.user.name + " " + this.user.surname;
    }
  }

  getUsername(): string {
    if ( this.user instanceof User ) {
      return this.user.getUsername();      
    } else {
      return this.user.username;
    }
  }

}
