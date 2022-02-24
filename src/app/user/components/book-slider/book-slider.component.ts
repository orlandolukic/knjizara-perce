import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { faChevronLeft, faChevronRight, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Book } from 'data/book/book';
import { RecommendBookService } from 'src/app/shared/services/modals/recommend-book-service';
import { BreakpointManager } from 'src/app/shared/utilities/breakpoint-manager';

@Component({
  selector: 'app-book-slider',
  templateUrl: './book-slider.component.html',
  styleUrls: ['./book-slider.component.scss']
})
export class BookSliderComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('bookSliderPlaceholder') bookSliderPlaceholder: ElementRef;
  @ViewChild('bookSliderWrapper') bookSliderWrapper: ElementRef;
  @ViewChild('bookslider') bookslider: ElementRef;
  @ViewChild('loader') loader: ElementRef;

  width: number;
  faChevronLeft: IconDefinition = faChevronLeft;
  faChevronRight: IconDefinition = faChevronRight;
  allowSlideshow: boolean;
  loaderClasses: string[];

  // Slider info    
  private static SLIDER_INTERVAL_VALUE: number = 4000;
  private sliderInterval: number;
  private sliderPauseTimeout: number;
  private destructed: boolean;
  private sliderIndex: number;
  private sliderMaxShown: number;
  private sliderContainerWidth: number;
  private mouseHovered: boolean;
  private isMouseEntered: boolean;
  bookSliderStyles: any;

  books: Book[];

  constructor(
    private cdr: ChangeDetectorRef,
    private recommendModalService: RecommendBookService
  ) { 
    this.loaderClasses = new Array<string>();
    this.bookSliderStyles = {};
    this.loaderClasses.push("X");
    this.destructed = false;
    this.sliderIndex = 0;
    this.sliderMaxShown = 3;
    this.mouseHovered = false;
    this.allowSlideshow = true;
    this.isMouseEntered = false;
  }

  ngOnInit(): void {   

    // Fetch books & init slider.
    this.fetchBooks()
    .then(() => this.showSlider())
    .then(() => {
      if ( this.destructed )
        return;  
        
      this.allowSlideshow = this.books.length > 3;      
      
      // Init slider logic.
      if ( this.allowSlideshow )
        this.startSlider();    
    });    

  }

  ngOnDestroy(): void {      
    this.destructed = true;    
    this.pauseSlideShow();
    this.clearPauseTimeout();      
  }

  ngAfterViewInit(): void {
    this.onResize();
  }

  private onResize(): void {
    this.pauseSlideShow();
    this.sliderContainerWidth = this.bookSliderWrapper.nativeElement.offsetWidth;    
    let divider: number = 3;
    let paddings: number = 20;
    switch( BreakpointManager.getDeviceSize(this.sliderContainerWidth) ) {
      case "xs":
        divider = 1;
        paddings = 20;  
        break;
      case "sm":
        divider = 2;
        paddings = 20;
        break;
    }
    this.width = this.sliderContainerWidth / divider - paddings;  
    this.cdr.detectChanges();        
  }

  private showSlider(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if ( !this.allowSlideshow )
        reject();
      this.loaderClasses.push("in-hiding");
      setTimeout(() => {
        resolve();
      }, 1200);
    });
  }

  private fetchBooks(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.books = [];
      let x: any = localStorage.getItem('books');
      let y: any = JSON.parse(x) as any[];
      for( let i=0; i<y.length; i++ ) {
        if ( y[i].onPromotion )
          this.books.push(y[i]);  
      }
      setTimeout(() => {        
        resolve();
      }, 300 + Math.random() * 1000);
    });
  }

  private startSlider(): void {
    window.clearInterval(this.sliderInterval);
    this.sliderInterval = window.setInterval(() => { 
      this.sliderSlideNext();            
    }, BookSliderComponent.SLIDER_INTERVAL_VALUE);    
  }

  private slide(): void {        
    this.bookSliderStyles.transform = "translateX(" + (-((30+this.width)*this.sliderIndex)) + "px)";
  }

  private resetSlider(): void {
    this.pauseSlideShow();
    this.bookSliderStyles.transform = "translateX(0)";
    this.startSlider();
  }

  private pauseSlideShow(): void {
    window.clearInterval(this.sliderInterval);
  }

  private initPauseTimeout(): void {
    this.clearPauseTimeout();
    this.sliderPauseTimeout = window.setTimeout(() => {
      this.startSlider();
    }, 1000);
  }

  private clearPauseTimeout(): void {
    window.clearTimeout(this.sliderPauseTimeout);
  }

  sliderSlideNext(): void { 
    
    this.pauseSlideShow();
    this.initPauseTimeout();

    this.sliderIndex++;
    this.sliderMaxShown++; 
    if ( this.sliderMaxShown-1 === this.books.length ) {
      this.sliderIndex = 0;
      this.sliderMaxShown = 3;
    }    
    this.slide();
  }

  sliderSlidePrevious(): void {

    this.pauseSlideShow();
    this.initPauseTimeout();

    this.sliderIndex--;
    this.sliderMaxShown--;    
    if ( this.sliderMaxShown === 2 ) {
      this.sliderIndex = this.books.length - 3;
      this.sliderMaxShown = this.books.length;
    }
    this.slide();
  }

  sliderMouseEntered(event: MouseEvent): void {    
    this.isMouseEntered = true;

    if ( !this.allowSlideshow )
        return;

    this.clearPauseTimeout();    
    this.pauseSlideShow();
  }

  sliderMouseLeaved(event: MouseEvent): void {
    this.isMouseEntered = false;
    if ( !this.allowSlideshow )
        return;
    this.startSlider();
  }

  recommendBook(book: any): void {    
    this.recommendModalService.openModal(book);
  }

  @HostListener('document:keyup.ArrowLeft', ['$event'])
  sliderKeyupLeft(event: KeyboardEvent): void {
    if ( this.isMouseEntered )
      this.sliderSlidePrevious();
  }

  @HostListener('document:keyup.ArrowRight', ['$event'])
  sliderKeyupRight(event: KeyboardEvent): void {
    if ( this.isMouseEntered )
      this.sliderSlideNext();    
  }

  @HostListener('window:resize', ['$event'])
  resize(event: Event): void {
    this.resetSlider();
    this.onResize();
  }

}
