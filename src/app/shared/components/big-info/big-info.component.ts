import { Component, Input, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: '[app-big-info]',
  templateUrl: './big-info.component.html',
  styleUrls: ['./big-info.component.scss']
})
export class BigInfoComponent implements OnInit {

  @Input()
  icon: IconDefinition;

  @Input()
  title: string;

  @Input()
  subtitle: string;

  constructor() { }

  ngOnInit(): void {
  }

}
