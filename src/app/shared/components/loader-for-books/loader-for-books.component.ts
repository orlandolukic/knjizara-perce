import { NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader-for-books',
  templateUrl: './loader-for-books.component.html',
  styleUrls: ['./loader-for-books.component.scss']
})
export class LoaderForBooksComponent implements OnInit {

  @Input('classes')
  loaderClasses: string[]|string;

  @Input()
  show: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
