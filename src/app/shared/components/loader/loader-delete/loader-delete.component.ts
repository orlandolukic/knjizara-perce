import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { faQuestionCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { SingleRecommendation } from 'data/interfaces/single-recommendation';
import { Subscription } from 'rxjs';
import { LoaderService, LoaderServiceInstructions } from 'src/app/shared/services/modals/loader-service';
import { LoaderComponent } from '../loader.component';

@Component({
  selector: 'app-loader-delete',
  templateUrl: './loader-delete.component.html',
  styleUrls: ['./loader-delete.component.scss'],  
})
export class LoaderDeleteComponent implements OnInit, OnDestroy {

  @Input()
  overlayOpacity?: number;

  @Input()
  textToDisplay: string;

  @Input()
  declineButtonText: string;

  @Input()
  confirmButtonText: string;

  @Input()
  showContent: boolean;

  // ==================================================================================

  @Output()
  confirm: EventEmitter<void> = new EventEmitter();

  @Output()
  decline: EventEmitter<void> = new EventEmitter();

  faQuestionMark: IconDefinition = faQuestionCircle;
  faTimes: IconDefinition = faTimesCircle;
  faCheck: IconDefinition = faCheckCircle;

  showDeleteLoader: boolean;
  showDeleteDialog: boolean;

  @ViewChild('loader', {read: LoaderComponent, static: true}) loader: LoaderComponent;
  private loaderSubscriptionOnShow: Subscription;
  private loaderSubscriptionOnHide: Subscription;

  constructor() { }

  ngOnInit(): void {
    this.overlayOpacity = 0.4;      
    this.loaderSubscriptionOnShow = this.getLoaderService().getSubLoaderListenerOnShow().subscribe(() => {
      this.showContent = true;
    });  
    this.loaderSubscriptionOnHide = this.getLoaderService().getSubLoaderListenerOnHide().subscribe(() => {
      this.showContent = false;
    });  
  }

  ngOnDestroy(): void {
    this.loaderSubscriptionOnShow.unsubscribe();
    this.loaderSubscriptionOnHide.unsubscribe();      
  }

  confirmDeleteRecommendation(event: Event): void {
    this.confirm.emit();
  }

  declineDeleteRecommendation(event: Event): void {
    this.decline.emit();
  }

  overlayClicked(): void {
    this.decline.emit();
  }

  public hideLoader(force: boolean = false): Promise<void> {
    return this.loader.getLoaderService().hideLoader(force);
  }

  public showLoader(instr?: LoaderServiceInstructions): void {
    this.loader.getLoaderService().showLoader(instr);
  }

  public getLoaderService(): LoaderService { return this.loader.getLoaderService(); }

}
