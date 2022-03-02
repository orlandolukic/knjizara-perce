import { Injectable } from '@angular/core';
import { Observable, Observer, Subject, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  private isAllowedToSelect: boolean;
  onSelectStartSubject: Subject<Event> = new Subject<Event>();

  constructor() { }

  getOnSelectStartObservable(): Observable<Event> { return this.onSelectStartSubject.asObservable(); }

  checkIfSelectionIsAllowed(e: Event): boolean {
    this.isAllowedToSelect = false;
    this.onSelectStartSubject.next(e);
    return this.isAllowedToSelect;
  }

  disallowToSelect(): void { this.isAllowedToSelect = false; }
  allowToSelect(): void { this.isAllowedToSelect = true; }
}
