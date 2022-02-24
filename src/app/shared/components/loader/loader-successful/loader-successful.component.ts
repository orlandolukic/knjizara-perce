import { AfterContentInit, AfterViewInit, Component, ContentChild, ContentChildren, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { faCheckDouble, faQuestionCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { LoaderService, LoaderServiceInstructions } from 'src/app/shared/services/modals/loader-service';
import { LoaderComponent } from '../loader.component';

@Component({
  selector: 'app-loader-successful',
  templateUrl: './loader-successful.component.html',
  styleUrls: ['./loader-successful.component.scss']
})
export class LoaderSuccessfulComponent implements OnInit, OnDestroy {

  @Input()
  zIndexPlaceholder?: number;

  @Input()
  icon: IconDefinition;

  @Input()
  overlayOpacity: number;

  @Input()
  textToDisplay: string;

  @Input()
  showContent: boolean;

  @Input()
  timeToWait: number;

  @Input()
  set startTransition(v: boolean) {
    if ( this.inTransition )
      return;

    this._startTransition = v;
    if ( !v )
      return;

    // Start transition and trigger the event!
    window.clearTimeout(this.loaderTimeout);
    this.loaderTimeout = window.setTimeout(() => {   
      console.log("loader timeout!");   
      this.dismissLoader();
      this.inTransition = false;
    }, this.timeToWait * 1000);
  }
  get startTransition(): boolean {
    return this._startTransition;
  }
  _startTransition: boolean;
  inTransition: boolean;

  // ==================================================================================

  @Output()
  dismiss: EventEmitter<void> = new EventEmitter();

  @Output()
  overlayClick: EventEmitter<void> = new EventEmitter();

  @ViewChild('loader', {read: LoaderComponent, static: true}) loader: LoaderComponent;
  private loaderSubscriptionOnShow: Subscription;
  private loaderSubscriptionOnHide: Subscription;

  private loaderTimeout: number;
  private isSetSlider: boolean;
  private slider: HTMLDivElement;

  constructor() { 
    this.startTransition = false;
    this.overlayOpacity = 0.5;
    this.zIndexPlaceholder = 999;    
    this.icon = faCheckDouble;    
    this.timeToWait = 5;
  }

  ngOnInit(): void {    
    this.loaderSubscriptionOnShow = this.getLoaderService().getSubLoaderListenerOnShow().subscribe(() => {           
      this.showContent = true;
      this.startTransition = true;
      this.inTransition = true;
    });  
    this.loaderSubscriptionOnHide = this.getLoaderService().getSubLoaderListenerOnHide().subscribe(() => {            
      window.clearTimeout(this.loaderTimeout); 
      this.inTransition = false;
      this.startTransition = false;
      this.showContent = false;
      this.isSetSlider = false;
    });      
  }

  ngOnDestroy(): void {
      this.loaderSubscriptionOnShow.unsubscribe();
      this.loaderSubscriptionOnHide.unsubscribe();
  }

  dismissLoader(): void {    
    this.dismiss.emit();
  }

  setSlider(slider: HTMLDivElement): void {
    if ( this.isSetSlider )
      return;
    this.slider = slider;
    this.isSetSlider = true;   
    this.slider.setAttribute('style', "animation-duration: " + this.timeToWait + "s;");      
  }

  overlayClicked(): void {
    this.overlayClick.emit();
  }

  public hideLoader(force: boolean): Promise<void> {
    return this.loader.getLoaderService().hideLoader(force);
  }

  public showLoader(instr?: LoaderServiceInstructions): void {
    this.loader.getLoaderService().showLoader(instr);
  }

  public getLoaderService(): LoaderService { return this.loader.getLoaderService(); }

}
