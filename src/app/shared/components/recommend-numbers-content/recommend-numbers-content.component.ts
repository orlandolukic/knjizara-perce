import { Component, Input, OnInit } from '@angular/core';
import { faBookmark, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-recommend-numbers-content',
  templateUrl: './recommend-numbers-content.component.html',
  styleUrls: ['./recommend-numbers-content.component.scss']
})
export class RecommendNumbersContentComponent implements OnInit {

  @Input('recommendations')
  recommendationNumber: number;

  faBookmark: IconDefinition = faBookmark;

  constructor() { }

  ngOnInit(): void {
  }

}
