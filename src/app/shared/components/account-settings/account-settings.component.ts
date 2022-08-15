import { Component, OnInit } from '@angular/core';
import { faEdit, faPen, faUserEdit, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { PathResolver } from 'data/path-resolver';
import { UserDataManipulation } from 'data/users/input.data';
import { User } from 'data/users/user';
import { UserBasicData } from 'data/users/user-basic-data';
import { animationFadeInY } from '../../animations/common.animation';
import { TitleService } from '../../services/title-service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
  animations: [
    animationFadeInY
  ]
})
export class AccountSettingsComponent implements OnInit {
  
  private static PATH_TO_IMAGES: string = PathResolver.PROFILE_PICTURE_DIRECTORY;

  faEdit: IconDefinition = faPen;

  user: User | UserBasicData;

  constructor(
    private titleService: TitleService
  ) {
    this.titleService.changeTitle($localize `Podešavanje naloga`);
  }

  ngOnInit(): void {
    this.user = UserDataManipulation.getLoggedInUser();    
  }

  getUserPictureURL(): string {
    if ( this.user instanceof User ) {
      return AccountSettingsComponent.PATH_TO_IMAGES + this.user.getImage();      
    } else {
      return AccountSettingsComponent.PATH_TO_IMAGES + this.user.image;
    }
  }

  getFullName(): string {
    if ( this.user instanceof User ) {
      return this.user.getFullName();      
    } else {
      return this.user.name + " " + this.user.surname;
    }
  }

  getName(): string {
    if ( this.user instanceof User ) {
      return this.user.getName();      
    } else {
      return this.user.name;
    }
  }

  getSurname(): string {
    if ( this.user instanceof User ) {
      return this.user.getSurname();      
    } else {
      return this.user.surname;
    }
  }

  getAddress(): string {
    if ( this.user instanceof User ) {
      return this.user.getAddress();      
    } else {
      return this.user.address;
    }
  }

  getContact(): string {
    if ( this.user instanceof User ) {
      return this.user.getTelephoneNo();      
    } else {
      return this.user.telephoneNo;
    }
  }

  getUsername(): string {
    if ( this.user instanceof User ) {
      return this.user.getUsername();      
    } else {
      return this.user.username;
    }
  }
  
  getEmail(): string {
    if ( this.user instanceof User ) {
      return this.user.getEmail();      
    } else {
      return this.user.email;
    }
  }

}
