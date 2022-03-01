import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { faStar, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-choose-star',
  templateUrl: './choose-star.component.html',
  styleUrls: ['./choose-star.component.scss']
})
export class ChooseStarComponent implements OnInit {

  @ViewChildren('stars', {read: ElementRef})
  stars: QueryList<ElementRef>;

  faStar: IconDefinition = faStar;

  rating: number;

  @Output()
  selected: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    this.rating = 0;
  }

  private setVisibleStar(i: number): void {        
    for (let ii = i; ii>=0; ii--)
      this.stars.get(ii)!.nativeElement.classList.remove("not-selected");
    for (let ii = i+1; ii<5; ii++)
      this.stars.get(ii)!.nativeElement.classList.add("not-selected");
  }

  private resetStars(): void {
    for (let i = 0; i<5; i++)
      this.stars.get(i)!.nativeElement.classList.add("not-selected");
  }

  private totallyResetStars(): void {
    try {
      for (let i = 0; i<5; i++) {
        this.stars.get(i)!.nativeElement.classList.add("not-selected");
        this.stars.get(i)!.nativeElement.classList.remove("selected");
      }
    } catch(e) {}
  }

  private setSelectedStar(i: number): void {
    for (let ii = i; ii>=0; ii--) {
      this.stars.get(ii)!.nativeElement.classList.add("selected");
      this.stars.get(ii)!.nativeElement.classList.remove("not-selected");
    }
    for (let ii = i+1; ii<5; ii++) {
      this.stars.get(ii)!.nativeElement.classList.remove("selected");
      this.stars.get(ii)!.nativeElement.classList.add("not-selected");
    }
  }

  enteredStar(i: number): void {   
    if ( this.rating > 0 ) {
      if ( i <= this.rating-1 )
        this.stars.get(i)!.nativeElement.classList.add("selected");
             
      for (let k=this.rating-1; k<=i; k++) {
        this.stars.get(k)!.nativeElement.classList.remove("not-selected");
      }
      for (let k=i+1; k<5; k++) {
        this.stars.get(k)!.nativeElement.classList.add("not-selected");
      }
      for (let k=this.rating-1; k>i; k--) {
        this.stars.get(k)!.nativeElement.classList.remove("selected");
        this.stars.get(k)!.nativeElement.classList.remove("not-selected");
      }    
    }  else {    
      this.setVisibleStar(i);    
    }
  }

  selectStar(i: number, send: boolean = true): void {
    this.rating = i + 1;
    this.setSelectedStar(i);
    if (send)
      this.selected.emit(i+1);
  }

  decline(): void {    
    this.resetStars();
    if ( this.rating > 0 ) {
      this.selectStar(this.rating-1, false);
    }
  }

  reset(): void {
    this.rating = 0;
    this.totallyResetStars();
  }

}

