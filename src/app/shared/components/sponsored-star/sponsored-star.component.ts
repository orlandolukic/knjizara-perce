import { Component, OnInit } from '@angular/core';
import { faStar, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sponsored-star',
  templateUrl: './sponsored-star.component.html',
  styleUrls: ['./sponsored-star.component.scss']
})
export class SponsoredStarComponent implements OnInit {

  faStar: IconDefinition = faStar;

  constructor() { }

  ngOnInit(): void {
  }

}
