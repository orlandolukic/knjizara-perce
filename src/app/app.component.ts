import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, HostListener, Inject, OnDestroy, Type } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, NavigationStart, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { faSpinner, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { filter, map, Subscription } from 'rxjs';
import { LoadService } from './shared/services/load-service';
import { InitialLoad } from '../../data/interfaces/initial-load';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {

  public static MODULE_NAME_LOADED: string;
  faSpinner: IconDefinition = faSpinner;
  visible: boolean;
  private loadServiceSubscription: Subscription;

  constructor(
    private router: Router,
    private loadService: LoadService,
    private changeDetector: ChangeDetectorRef ,
    private activatedRoute: ActivatedRoute   
  ) {   

    this.router.events.subscribe(event => {           
      if ( event instanceof RouteConfigLoadStart ) {
        this.loadService.registerResolver();        
      } else if ( event instanceof RouteConfigLoadEnd ) {
        setTimeout(() => {
          this.loadService.deregisterResolver();
          this.loadService.checkIfReadyToShow();      
        }, 400);
      } else if ( event instanceof NavigationStart ) {        
        this.loadService.setTransition();
      } else if ( event instanceof NavigationEnd ) {        
        this.loadService.resetTransition();      
        this.loadService.checkIfReadyToShow();  
      }
    });

    // Disable selection on window
    window.onselectstart = function() {
      return false;
    }
  }

  ngOnDestroy(): void {    
    this.loadServiceSubscription.unsubscribe();
  }
  
  ngOnInit(): void {       
    this.visible = false;  
  }


  ngAfterViewInit(): void {    
    this.loadServiceSubscription = this.loadService.subscribe((v: string) => {          
      if ( v === "START" ) {        
        this.visible = true;                
      } else if ( v === "FINISH" ) {
        this.visible = false;            
      }   
      this.changeDetector.detectChanges();         
    })  
  }


}
