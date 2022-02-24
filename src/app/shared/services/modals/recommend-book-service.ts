import { EventEmitter, Injectable } from "@angular/core";
import { Book } from "data/book/book";
import { BookDataManipulation } from "data/book/book-data-manipulation";
import { BookRecommendationController } from "data/book/recommendation/book-recommendation-controller";
import { User } from "data/users/user";
import { UserBasicData } from "data/users/user-basic-data";


@Injectable() 
export class RecommendBookService {

    private modalOnInit: EventEmitter<Book>;
    private modalOnShowing: EventEmitter<void>;
    private modalOnShow: EventEmitter<void>;
    private modalOnHiding: EventEmitter<void>;
    private modalOnHidden: EventEmitter<void>;  

    private recommendationDelete: {book: Book, forUser: UserBasicData} | null;
    private onRecommendationDelete: EventEmitter<{book: Book, forUser: UserBasicData}|null>;
    private onRecommendationDeleteInit: EventEmitter<{book: Book, forUser: UserBasicData}|null>;
    
    private modalEvent: EventEmitter<{book: Book, operation: string}>;


    constructor() {  
        this.recommendationDelete = null;      
        this.modalOnInit = new EventEmitter<Book>();
        this.modalOnShowing = new EventEmitter<void>();
        this.modalOnShow = new EventEmitter<void>();
        this.modalOnHiding = new EventEmitter<void>();
        this.modalOnHidden = new EventEmitter<void>();    
        this.modalEvent = new EventEmitter<{book: Book, operation: string}>();     
        this.onRecommendationDelete = new EventEmitter<{book: Book, forUser: UserBasicData}|null>();  
        this.onRecommendationDeleteInit = new EventEmitter<{book: Book, forUser: UserBasicData}|null>();    
    }

    public getModalOnInit(): EventEmitter<Book> { return this.modalOnInit; }
    public getModalOnShowing(): EventEmitter<void> { return this.modalOnShowing; }
    public getModalOnShow(): EventEmitter<void> { return this.modalOnShow; }
    public getModalOnHiding(): EventEmitter<void> { return this.modalOnHiding; }
    public getModalOnHidden(): EventEmitter<void> { return this.modalOnHidden; }  
    public getModalEvent(): EventEmitter<{book: Book, operation: string}> { return this.modalEvent; }  
    public getOnRecommendationDelete(): EventEmitter<{book: Book, forUser: UserBasicData}|null> { return this.onRecommendationDelete; }  
    public getOnRecommendationDeleteInit(): EventEmitter<{book: Book, forUser: UserBasicData}|null> { return this.onRecommendationDeleteInit; }  
    
    public openModal(book: Book): void {
        this.modalEvent.emit({
            book: book,
            operation: "open"
        });
    }

    public closeModal(): void {

    }

    public setRecommendationDeleteRequest(x: {book: Book, forUser: UserBasicData} | null): void {
        this.recommendationDelete = x;
        this.onRecommendationDeleteInit.emit(this.recommendationDelete);
    }

    public getRecommendationDeleteRequest(): {book: Book, forUser: UserBasicData} | null {
        return this.recommendationDelete;
    }

    public execRecommendationDelete(): Promise<{book: Book, forUser: UserBasicData} | null> {
        return new Promise<{book: Book, forUser: UserBasicData} | null>((resolve, reject) => {
            // Send data to the server.
            BookRecommendationController.removeBookRecommendation(this.recommendationDelete!);
            setTimeout(() => {
                resolve(this.recommendationDelete);
            }, 1300 + Math.random() * 500);
        });
    }


}
