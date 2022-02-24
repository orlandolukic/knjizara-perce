import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  // Inputs from parent.
  @Input() icon: IconDefinition;
  @Input() color?: string;
  @Input() size?: string;
  @Input() disabled?: boolean;

  // Outputs to parent.
  @Output() buttonClick: EventEmitter<MouseEvent>;

  buttonClasses: string[];

  constructor() { 
    this.buttonClick = new EventEmitter<MouseEvent>();  
    this.disabled = false;  
  }

  ngOnInit(): void {
    if ( !this.color ) {
      this.color = "primary";
    }

    if ( !this.size ) {
      this.size = "md";
    }

    this.buttonClasses = [];
    this.buttonClasses.push( 'theme-button-' + this.color );
    this.buttonClasses.push( 'theme-button-' + this.size );
  }

  onClick(event: MouseEvent): void {        
    this.buttonClick.emit(event);
  }

}
