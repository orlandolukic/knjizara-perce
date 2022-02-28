import { Component, Input, OnInit } from '@angular/core';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-trait',
  templateUrl: './trait.component.html',
  styleUrls: ['./trait.component.scss']
})
export class TraitComponent implements OnInit {

  @Input()
  title: string;

  @Input()
  icon: IconDefinition;

  @Input()
  iconClass: string;

  @Input()
  iconSize: SizeProp | undefined;

  @Input()
  value: number;

  constructor() { }

  ngOnInit(): void {
  }

}
