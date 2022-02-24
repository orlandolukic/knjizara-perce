import { AfterViewInit, Component, ComponentRef, HostListener, OnDestroy, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { faCheck, faCircleNotch, faEllipsisH, faSpinner, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Book } from 'data/book/book';
import { BookDataManipulation } from 'data/book/book-data-manipulation';
import { Subscription } from 'rxjs';
import { RecommendBookService } from 'src/app/shared/services/modals/recommend-book-service';
import { BookSliderSingleBookComponent } from '../book-slider-single-book/book-slider-single-book.component';

interface SingleBookResource<T> {
  componentRef: ComponentRef<T>,
  outputRecommendSubscription: Subscription,
  timeoutToPreview?: Promise<void>
}

@Component({
  selector: 'app-all-books-listing',
  templateUrl: './all-books-listing.component.html',
  styleUrls: ['./all-books-listing.component.scss']
})
export class AllBooksListingComponent implements OnInit, AfterViewInit, OnDestroy {

  faSpinner: IconDefinition = faCircleNotch;
  faEllipsis: IconDefinition = faEllipsisH;
  showBooks: boolean;
  books: Book[];
  singleBookResources: SingleBookResource<BookSliderSingleBookComponent>[];
  lastShowIndex: number;
  loading: boolean;
  allBooksNumber: number;
  loadedEverything: boolean;
  inFetchingBooks: boolean;
  fetchedEverythingFromServer: boolean;

  @ViewChild('bookHost', {read: ViewContainerRef, static: true}) bookContainer: ViewContainerRef;

  constructor(
    private modalService: RecommendBookService
  ) { }

  ngOnInit(): void {
    this.showBooks = false;   
    this.loadedEverything = false;   
    this.fetchedEverythingFromServer = false;
    this.singleBookResources = new Array<SingleBookResource<BookSliderSingleBookComponent>>();    
  }

  ngOnDestroy(): void {
      this.singleBookResources.forEach((elem: SingleBookResource<BookSliderSingleBookComponent>, index: number, arr: SingleBookResource<BookSliderSingleBookComponent>[]) => {
        elem.outputRecommendSubscription.unsubscribe();        
      });
  }

  refresh(): void {
    this.showBooks = false;
  }

  ngAfterViewInit(): void {
    this.books = new Array<Book>(); 
    this.lastShowIndex = 0;        
    
    Promise.all([
      this.fetchNewSetOfBooks(),
      this.getNumberOfAllBooks()
    ]).then((params: [Book[], number]) => {
      this.allBooksNumber = params[1];
      this.addNewBooks(params[0]);        
      this.loading = false;
      this.showBooks = true;
      this.fetchedEverythingFromServer = true;
    });
  }

  private addNewBooks(books: Book[]): Promise<void> {
    
    if ( this.lastShowIndex === this.allBooksNumber ) {
      this.declineAddingNewBooks();
      return new Promise<void>((resolve, reject) => resolve());
    }

    this.books = this.books.concat(books);        
    let compRef: ComponentRef<BookSliderSingleBookComponent>;
    let subs: Subscription;
    let arrOfNewResources: SingleBookResource<BookSliderSingleBookComponent>[] = [];
    let promisesArr: Promise<void>[] = [];
    const container = this.bookContainer;
    for(let i=0; i<books.length; i++) {
      
      compRef = container.createComponent<BookSliderSingleBookComponent>(BookSliderSingleBookComponent);                
      compRef.location.nativeElement.classList.add("in-list");
      compRef.location.nativeElement.classList.add("col-12");
      compRef.location.nativeElement.classList.add("col-sm-6");
      compRef.location.nativeElement.classList.add("col-lg-4");      

      this.lastShowIndex++;
            
      subs = compRef.instance.recommend.subscribe((b: Book) => {
        this.recommendBook(b);
      });
      compRef.instance.book = books[i];        

      // Add this component to local resources.
      let singleBookResource: SingleBookResource<BookSliderSingleBookComponent> = {
        componentRef: compRef,
        outputRecommendSubscription: subs        
      };
      this.singleBookResources.push(singleBookResource);
      arrOfNewResources.push(singleBookResource);
      singleBookResource.timeoutToPreview = new Promise<void>((resolve, reject) => {        
        setTimeout(() => {          
          singleBookResource.componentRef.location.nativeElement.classList.add("in-list-loaded");
          resolve();
        }, 300 + i*200);
      });
      promisesArr.push(singleBookResource.timeoutToPreview);
    }
    
    return Promise.all(promisesArr).then();   
  }

  private declineAddingNewBooks(): void {
    this.loadedEverything = true;
    this.loading = false;
  }

  recommendBook(b: Book): void {       
    this.modalService.openModal(b);
  }

  @HostListener("body:scroll", ["$event"])
  onWindowScroll() {

    if ( !this.fetchedEverythingFromServer )
      return;

    let body = document.body,
    html = document.documentElement;

    let max = Math.max( body.scrollHeight, body.offsetHeight, 
                          html.clientHeight, html.scrollHeight, html.offsetHeight );    
    let pos = (html.scrollTop || body.scrollTop) + html.offsetHeight;    
    if( max - pos < 120 && !this.inFetchingBooks && this.lastShowIndex < this.allBooksNumber )   {
      this.loading = true;
      this.fetchBooks();
    }
  }

  onPreviewMore(event: MouseEvent): void {
    this.loading = true;
    this.fetchBooks();
  }

  private fetchBooks(): Promise<void> {
    return this.fetchNewSetOfBooks().then((books: Book[]) => {
      return this.addNewBooks(books).then(() => {
        this.loading = false;
        if ( this.lastShowIndex === this.allBooksNumber ) {
          this.loadedEverything = true;
        }
      });            
    });
  }

  private getNumberOfAllBooks(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      setTimeout(() => {
        resolve(BookDataManipulation.numberOfAllBooks());
      }, 300 + Math.random() * 560);
    });
  }

  private fetchNewSetOfBooks(): Promise<Book[]> {
    return new Promise<Book[]>((resolve, reject) => {
      // Go and get books from the server.
      this.inFetchingBooks = true;
      let books: Book[] = BookDataManipulation.getAllBooks(this.lastShowIndex, 6);
      setTimeout(() => {
        this.inFetchingBooks = false;
        resolve(books);
      }, 700 + Math.random()*360);
    });
  }



}
