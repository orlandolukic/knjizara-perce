import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit, AfterViewInit, AfterContentInit {

  // Inputs from parent.
  @Input() icon: IconDefinition;
  @Input() color?: string;
  @Input() size?: string;
  @Input() disabled?: boolean;

  // Outputs to parent.
  @Output() buttonClick: EventEmitter<MouseEvent>;
  @ViewChild('textSection', {static: false, read: ElementRef}) textSection: ElementRef;

  buttonClasses: string[];
  hasContent: boolean;

  constructor(
    private cdr: ChangeDetectorRef
  ) { 
    this.buttonClick = new EventEmitter<MouseEvent>();  
    this.disabled = false;  
    this.hasContent = true;
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

  ngAfterContentInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.hasContent = this.textSection.nativeElement.children.length > 0;
    this.cdr.detectChanges();
  }

  onClick(event: MouseEvent): void {        
    this.buttonClick.emit(event);
  }

}
