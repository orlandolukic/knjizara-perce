import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { faSearch, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { SearchBook } from 'data/interfaces/search-book';

@Component({
  selector: 'app-search-book',
  templateUrl: './search-book.component.html',
  styleUrls: ['./search-book.component.scss']
})
export class SearchBookComponent implements OnInit {

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

  @Output()
  searched: EventEmitter<SearchBook> = new EventEmitter();

  @ViewChild('searchbox', {read: ElementRef, static: true})
  searchbox: ElementRef;

  constructor() {
    this.value = "";
    this.width = "auto";
   }

  ngOnInit(): void {
    
  }

  search(event: Event): void {    
    this.searched.emit({
      searchedValue: this.searchbox.nativeElement.value,
      event: event
    });
  }

}
