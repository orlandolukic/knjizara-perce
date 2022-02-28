import { Component, Input, OnInit } from '@angular/core';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ThemeColors } from 'data/types';

@Component({
  selector: '[app-big-info]',
  templateUrl: './big-info.component.html',
  styleUrls: ['./big-info.component.scss']
})
export class BigInfoComponent implements OnInit {

  @Input()
  icon: IconDefinition;

  @Input()
  iconSize: SizeProp | undefined;

  @Input()
  iconColor: ThemeColors;

  @Input()
  title: string;

  @Input()
  titleColor: ThemeColors;

  @Input()
  subtitle: string;

  

  constructor() { }

  ngOnInit(): void {
    if ( !this.iconSize )
      this.iconSize = "8x";
  }

}
