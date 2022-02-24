import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorage } from 'data/local-storage';

@Component({
  selector: 'app-flush-localstorage',
  templateUrl: './flush-localstorage.component.html',
  styleUrls: ['./flush-localstorage.component.scss']
})
export class FlushLocalstorageComponent implements OnInit, AfterViewInit {

  constructor(
    private router: Router
  ) { 
    
  }

  ngOnInit(): void {   
    sessionStorage.clear();    
    LocalStorage.clearData();
    LocalStorage.initData();
  }

  ngAfterViewInit(): void {
    this.router.navigate(['login']);  
  }

}
