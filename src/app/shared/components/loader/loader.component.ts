import { NgClass } from '@angular/common';
import { Component, ContentChild, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { faCircleNotch, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { LoaderService, LoaderServiceInstructions } from '../../services/modals/loader-service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  providers: [LoaderService]
})
export class LoaderComponent implements OnInit, OnDestroy {

  public static OPEN: number = 1;
  public static CLOSE: number = 2;

  @Input()
  overlayColor: "dark" | "light";

  @Input()
  color: "primary" | "success" | "danger" | "starcolor";

  @Input()
  overlayOpacity: number;

  @Input()
  zIndexPlaceholder: number;

  @Input()
  zIndexOverlay: number;

  @Input()
  zIndexContent: number;

  @Input()
  set show(s: boolean) {
    this.isHidden = !s;
    this._show = s;
  }
  get show() { return this._show; }
  private _show: boolean;

  @Input()
  fixed: boolean;

  @Output()
  overlayClick: EventEmitter<void> = new EventEmitter();

  faCircleONotch: IconDefinition = faCircleNotch;
  isHidden: boolean;
  showWithTransition: boolean;
  hideWithTransition: boolean;
  transitionDelayShow: number;
  transitionDelayHide: number;
  private transitionTimeout: number;
  private loaderSubscriberOnShowInit: Subscription;
  private loaderSubscriberOnShow: Subscription;
  private loaderSubscriberOnHide: Subscription;
  private action: number;

  constructor(
    protected service: LoaderService
  ) { 
    this.service.setLoaderComponent(this);    
    this.zIndexPlaceholder = 1;
    this.zIndexOverlay = 1;
    this.zIndexContent = 2;
    this.overlayOpacity = 0.8;   
    this.overlayColor = "light"; 
    this.fixed = false;

    this.show = false;
    this.isHidden = true;
    this.hideWithTransition = false;
    this.showWithTransition = false;    
  }

  ngOnInit(): void {       

    this.loaderSubscriberOnShowInit = this.service.getLoaderListenerOnShowInit().subscribe(() => {
      
    });

    this.loaderSubscriberOnShow = this.service.getLoaderListenerOnShow().subscribe((instr: LoaderServiceInstructions) => {        
        this.showWithTransition = false;
        this.hideWithTransition = false;
        this.transitionDelayShow = instr.transitionDelayShow ? instr.transitionDelayShow : 500;              
        this.transitionDelayHide = instr.transitionDelayHide ? instr.transitionDelayHide : 500;   
        this.show = true;                
    });

    this.loaderSubscriberOnHide = this.service.getLoaderListenerOnHide().subscribe(() => {
      if ( !this.show )
        return;      
      this.show = false;
      this.showWithTransition = false;
    });

  }

  ngOnDestroy(): void {
      this.loaderSubscriberOnShow.unsubscribe();  
      this.loaderSubscriberOnShowInit.unsubscribe();    
      this.loaderSubscriberOnHide.unsubscribe();
      window.clearTimeout(this.transitionTimeout);
  }

  public getLoaderService(): LoaderService { return this.service; }

  @HostListener('document:keyup.Escape', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    if ( this.isHidden || !this.service.isAllowedToDismiss() )
      return;      
    this.hideLoader();
  }

  hideLoader(): void {    
    if ( !this.service.isAllowedToDismiss() )
      return;    
    this.overlayClick.emit();
  }

  setTransitionAndWait(): Promise<void> {
    return new Promise<void>((resolve, reject) => {    
      this.showWithTransition = true;
      window.clearTimeout(this.transitionTimeout);
      this.transitionTimeout = window.setTimeout(() => {        
        resolve();
      }, this.transitionDelayShow);
    });
  }

  setTransitionAndWaitToClose(): Promise<void> {
    return new Promise<void>((resolve, reject) => {    
      this.hideWithTransition = true;
      window.clearTimeout(this.transitionTimeout);
      this.transitionTimeout = window.setTimeout(() => {
        resolve();
      }, this.transitionDelayHide);
    });
  }

}
