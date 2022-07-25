import { Component, Input, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ThemeColors } from 'data/types';

@Component({
  selector: '[app-info-message]',
  templateUrl: './info-message.component.html',
  styleUrls: ['./info-message.component.scss']
})
export class InfoMessageComponent implements OnInit {

  @Input()
  icon: IconDefinition;

  @Input()
  color: ThemeColors;

  constructor() { }

  ngOnInit(): void {
    if ( this.color === null )
      this.color = "primary";
  }

}
