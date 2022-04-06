import { AfterViewInit, ChangeDetectorRef, Component, ComponentRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { faArchive, faBookAtlas, faCheck, faCircleNotch, faEllipsisH, faMartiniGlassEmpty, faSpinner, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Book } from 'data/book/book';
import { BookDataManipulation } from 'data/book/book-data-manipulation';
import { PathResolver } from 'data/path-resolver';
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

  @Input()
  set searchTerm(searchTerm: string) {      
    this._searchTerm = searchTerm;    
    this.lastShowIndex = 0;
    this.beforeDisplayBooks();
    this.displayBooks();
  };
  get searchTerm(): string { return this._searchTerm; }
  private _searchTerm: string;

  @Output()
  booksFound: EventEmitter<number> = new EventEmitter();

  faSpinner: IconDefinition = faCircleNotch;
  faEllipsis: IconDefinition = faEllipsisH;
  faEmptySet: IconDefinition = faArchive;
  faBooks: IconDefinition = faBookAtlas;
  showBooks: boolean;
  books: Book[];
  singleBookResources: SingleBookResource<BookSliderSingleBookComponent>[];
  lastShowIndex: number;
  loading: boolean;
  allBooksNumber: number;
  loadedEverything: boolean;
  inFetchingBooks: boolean;
  fetchedEverythingFromServer: boolean;
  allowedToFetchMore: boolean;
  booksAnimation: any;

  @ViewChild('bookHost', {read: ViewContainerRef, static: true}) bookContainer: ViewContainerRef;

  noBooksFoundTitle: string;
  noBooksFoundSubtitle: string;

  constructor(
    private modalService: RecommendBookService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.showBooks = false;   
    this.loadedEverything = false;   
    this.allowedToFetchMore = true; 
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
    if ( this.searchTerm === undefined ) {
      this.beforeDisplayBooks();
      this.displayBooks();        
    }
  }

  getURLForAllBooks(): string {
    return PathResolver.getPathForAllBooks();
  }

  private beforeDisplayBooks(): void {

    this.inFetchingBooks = true;
    this.showBooks = false;    
      
    // Clear everything from the container.
    this.bookContainer.clear();    
  }

  private displayBooks(): void {
    Promise.all([
      this.fetchNewSetOfBooks(),
      this.getNumberOfAllBooks()
    ]).then((params: [Book[], number]) => {
      this.allBooksNumber = params[1];
      this.addNewBooks(params[0]);     
      this.booksFound.emit(params[1]);   
      this.loading = false;
      this.showBooks = true;
      this.fetchedEverythingFromServer = true;
      this.loadedEverything = this.lastShowIndex === this.allBooksNumber;
      if ( this.allBooksNumber === 0 && this.searchTerm ) {
        this.noBooksFoundTitle = $localize `Nema rezultata pretrage`;
        this.noBooksFoundSubtitle = $localize `Nismo uspeli da pronađemo knjige za zadati kriterijum '${this.searchTerm}'`;
      } else if ( this.allBooksNumber === 0 ) {
        this.noBooksFoundTitle = $localize `Trenutno nema knjiga`;
        this.noBooksFoundSubtitle = `U procesu smo nabavke knjiga, molimo Vas pokušajte kasnije`;
      }
    });
  }

  private addNewBooks(books: Book[]): Promise<void> {  

    this.books = this.books.concat(books);        
    let compRef: ComponentRef<BookSliderSingleBookComponent>;
    let subs: Subscription;
    let arrOfNewResources: SingleBookResource<BookSliderSingleBookComponent>[] = [];
    let promisesArr: Promise<void>[] = [];
    const container = this.bookContainer;

    if ( books.length === 0 ) {
      this.noBooksFound();
      return new Promise<void>((resolve, reject) => resolve());
    }

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
      let iObj: any = { i: i };
      this.singleBookResources.push(singleBookResource);
      arrOfNewResources.push(singleBookResource);  
      singleBookResource.timeoutToPreview = new Promise<void>((resolve, reject) => {        
        compRef.instance.showBook = { value: "animating", params: { delay: (300 + i*300) + "ms", duration: (1000 + i*100) + "ms" }, resolvePromise: resolve };    
      });
      promisesArr.push();
      promisesArr.push(singleBookResource.timeoutToPreview);
    }
    
    return Promise.all(promisesArr).then();   
  }

  private noBooksFound(): void {

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

    if ( !this.fetchedEverythingFromServer || !this.allowedToFetchMore )
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
      let numberOfAllBooks: number;
      if ( !this.searchTerm || this.searchTerm === "" ) {
        numberOfAllBooks = BookDataManipulation.numberOfAllBooks();
      } else {
        numberOfAllBooks = BookDataManipulation.numberOfAllBooksForGivenSearchTerm(this.searchTerm);
      }
      this.allowedToFetchMore = numberOfAllBooks > 6;    
      this.cdr.detectChanges();
      setTimeout(() => {
        resolve(numberOfAllBooks);
      }, 300 + Math.random() * 560);
    });
  }

  private fetchNewSetOfBooks(): Promise<Book[]> {
    return new Promise<Book[]>((resolve, reject) => {
      // Go and get books from the server.
      this.inFetchingBooks = true;
      let books: Book[];
      if ( this.searchTerm && this.searchTerm !== "" ) {
        books = BookDataManipulation.getAllBooksForGivenSearchTerm(this.searchTerm, this.lastShowIndex, 6);        
      } else {        
        books = BookDataManipulation.getAllBooks(this.lastShowIndex, 6);        
      }                       
      setTimeout(() => {
        this.inFetchingBooks = false;
        resolve(books);
      }, 700 + Math.random()*360);
    });
  }



}
