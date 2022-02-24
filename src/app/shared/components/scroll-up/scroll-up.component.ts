import { Component, HostListener, OnInit } from '@angular/core';
import { faChevronUp, faScroll, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-scroll-up',
  templateUrl: './scroll-up.component.html',
  styleUrls: ['./scroll-up.component.scss']
})
export class ScrollUpComponent implements OnInit {

  faScrollIcon: IconDefinition = faChevronUp;
  isVisible: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener("body:scroll", ['$event'])
  onScroll(event: Event): void {
    let body = document.body,
    html = document.documentElement;

    let pos = (html.scrollTop || body.scrollTop);    
    if( pos > 250 )   {
      this.isVisible = true;
    } else {
      this.isVisible = false;
    }
  }

  scroll(event: MouseEvent): void {
    document.body.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

}
