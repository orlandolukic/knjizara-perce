import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { faSearch, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { SearchBook } from 'data/interfaces/search-book';

@Component({
  selector: 'app-search-book',
  templateUrl: './search-book.component.html',
  styleUrls: ['./search-book.component.scss']
})
export class SearchBookComponent implements OnInit, OnDestroy {

  faSearch: IconDefinition = faSearch;

  @Input()
  value?: string;

  @Input()
  set width(s: string) {
    this._width = s;    
  }
  get width(): string {
    return this._width;
  }
  private _width: string;

  @Input()
  allowedToBeEmpty: boolean;

  @Input()
  allowSmoothSearch: boolean;

  @Output()
  searched: EventEmitter<SearchBook> = new EventEmitter();

  @ViewChild('searchbox', {read: ElementRef, static: true})
  searchbox: ElementRef;


  showError: boolean;
  showErrorTimeout: number;
  smoothTimeout: number;

  constructor() {
    this.value = "";
    this.width = "auto";
    this.allowedToBeEmpty = false;
    this.allowSmoothSearch = false;
   }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {    
    window.clearTimeout(this.showErrorTimeout);
    window.clearTimeout(this.smoothTimeout);
  }

  public focus(): void {
    this.searchbox.nativeElement.focus();
  }

  keyup(event: Event): void {
    
    if ( !this.allowSmoothSearch )
      return;

    window.clearTimeout(this.smoothTimeout);
    this.smoothTimeout = window.setTimeout(() => {
      this.startSearch(event);
    }, 500);
  }

  search(event: Event): void {    
    window.clearTimeout(this.showErrorTimeout);
    window.clearTimeout(this.smoothTimeout);
    this.startSearch(event);
  }

  private startSearch(event: Event): void {
    if ( this.searchbox.nativeElement.value === "" && !this.allowedToBeEmpty ) {
      this.showError = true;
      this.showErrorTimeout = window.setTimeout(() => {
        this.showError = false;
      }, 4000);
    } else 
      this.searched.emit({
        searchedValue: this.searchbox.nativeElement.value,
        event: event
      });
  }

}
