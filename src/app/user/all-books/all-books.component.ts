import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-books',
  templateUrl: './all-books.component.html',
  styleUrls: ['./all-books.component.scss']
})
export class AllBooksComponent implements OnInit {

  books: Array<number>;

  constructor() { }

  ngOnInit(): void {
    this.books = [
      1, 2, 3
    ];
  }

}
