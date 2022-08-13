import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faCheck, faSpinner, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { NotifierService } from 'angular-notifier';
import { UserDataManipulation } from 'data/users/input.data';
import { animationFadeInY } from 'src/app/shared/animations/common.animation';
import { LoadService } from 'src/app/shared/services/load-service';
import { TitleService } from 'src/app/shared/services/title-service';

@Component({
  selector: 'app-account-recovery',
  templateUrl: './account-recovery.component.html',
  styleUrls: ['./account-recovery.component.scss'],
  animations: [
    animationFadeInY,    
  ]
})
export class AccountRecoveryComponent implements OnInit, AfterViewInit {
  
  @ViewChild("identificationData", { read: ElementRef, static: true })
  identificationData: ElementRef;
  
  @ViewChild("dataField", { read: ElementRef, static: true })
  dataField: ElementRef;

  faSpinner: IconDefinition = faSpinner;
  faCheck: IconDefinition = faCheck;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;  
  width: string;

  constructor(
    private titleService: TitleService,
    private router: Router,
    private notifier: NotifierService,
    private cdr: ChangeDetectorRef,
    private loadSerivice: LoadService
  ) { 
    this.width = 'auto';
  }

  ngOnInit(): void {
    this.isError = false;  
    this.titleService.changeTitle($localize `Oporavak lozinke`);
  }

  ngAfterViewInit(): void {
    this.identificationData.nativeElement.focus();
    this.width = (this.dataField.nativeElement.offsetWidth + 10) + 'px';    
    this.cdr.detectChanges();
  }

  validate(input: HTMLInputElement): void {
    const value = input.value;
    if ( value.trim() === "" || value.length < 3 ) {
      this.isError = true;
      this.errorMessage = $localize `Polje mora imati barem 3 karaktera`;      
    } else {      
      this.isError = false;
    }
  }

  process(): void {
    this.validate(this.identificationData.nativeElement);
    if ( !this.isError ) {
      const value = this.identificationData.nativeElement.value;
      // Check if user exists with given data
      if ( UserDataManipulation.hasUsername(value) || UserDataManipulation.hasEmail(value) ) {
        this.loadSerivice.startLoading();
        setTimeout(() => {        
          this.notifier.notify('success', $localize `Poslali smo Vam zahtev za promenu lozinke na e-mail`);
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 1200);        
        }, 1300 + Math.random() * 1000);      
      } else {
        this.loadSerivice.startLoading();
        setTimeout(() => {
          this.loadSerivice.finishLoading();
          this.notifier.notify('error', $localize `Ne postoji korisnik sa unetim podacima`);
          this.identificationData.nativeElement.focus();    
        }, 700 + Math.random() * 1500);    
      }
    } 
  }

}
