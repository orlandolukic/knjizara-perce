import { UserDataManipulation } from "data/users/input.data";
import { Buyer, User } from "data/users/user";
import { UserBasicData } from "data/users/user-basic-data";
import { Book } from "../book";
import { BookDataManipulation } from "../book-data-manipulation";
import { BookRecommendation } from "../book-recommendation";
import { BookRecommendationUserList } from "../book-recommendation-user-list";
import { BookRecommendationDisplay } from "./book-recommendation-display";


export class BookRecommendationController {

    public static addRecommendations(obj: BookRecommendationUserList[], book: Book): void {

        let recommendations: BookRecommendation[] = new Array<BookRecommendation>();        
        for( let i = 0; i < obj.length; i++ ) {
            recommendations.push({
                bookID: book.id,
                date: new Date(),
                usernameReceiver: obj[i].buyer.getUsername(),
                usernameSender: UserDataManipulation.getLoggedInUser().getUsername()
            });
        }        

        // Join with other recommendations.
        let otherRecommendationsString: string|null = localStorage.getItem('bookRecommendations');                
        if ( otherRecommendationsString === null ) {
            localStorage.setItem('bookRecommendations', JSON.stringify(recommendations));
        } else {
            let otherRecommendations: any[] = JSON.parse(otherRecommendationsString);
            otherRecommendations = otherRecommendations.concat(recommendations);                        
            localStorage.setItem('bookRecommendations', JSON.stringify(otherRecommendations));
        }
    }

    public static isRecommended(book: Book, forUser: Buyer): boolean {
        let x: string|null = localStorage.getItem('bookRecommendations');
        let recommendations: BookRecommendation[];
        if ( x ) {
            recommendations = JSON.parse(x);
            for (let i=0; i<recommendations.length; i++) {           
                if ( book.id != recommendations[i].bookID || recommendations[i].usernameSender !== UserDataManipulation.getLoggedInUser().getUsername() )
                    continue;
                if ( recommendations[i].usernameReceiver === forUser.getUsername() ) 
                    return true;
            }
        }
        return false;
    }

    public static getSentRecommendationNumberFor(book: Book): number {
       return BookRecommendationController.getSentRecommendationNumberForId(book.id);
    }

    public static getSentRecommendationNumberForId(id: number): number {
        let x: string|null = localStorage.getItem('bookRecommendations');
        let recommendations: BookRecommendation[];
        let res: number = 0;
        if ( x ) {
            recommendations = JSON.parse(x);
            for (let i=0; i<recommendations.length; i++) {                           
                if ( recommendations[i].bookID === id ) 
                    res++;
            }
        }
        return res;
    }

    public static getAllRecommendationsForUser(): BookRecommendationDisplay[] {
        let arr: BookRecommendationDisplay[] = new Array<BookRecommendationDisplay>();
        let x: string|null = localStorage.getItem('bookRecommendations');
        let recommendations: BookRecommendation[];        
        if ( x ) {
            recommendations = JSON.parse(x);
            for (let i=0; i<recommendations.length; i++) {                           
                if ( recommendations[i].usernameReceiver !== UserDataManipulation.getLoggedInUser().username ) 
                    continue;
                let book: Book|null = BookDataManipulation.getBookById(recommendations[i].bookID);
                let userForDisplay: UserBasicData|null = UserDataManipulation.getUserForDisplay(recommendations[i].usernameSender);
                arr.push({
                    book: book,
                    userWhichRecommended: userForDisplay,
                    date: recommendations[i].date
                });
            }
        }
        return arr;
    }

    public static removeBookRecommendation(val: {book: Book, forUser: UserBasicData}): void {          
        if ( !val )
            return;             

        let x: string|null = localStorage.getItem('bookRecommendations');
        let recommendations: BookRecommendation[];        
        if ( x ) {
            recommendations = JSON.parse(x);
            recommendations = recommendations.filter((elem: BookRecommendation) => {                                
                if ( elem.bookID === val.book.id && 
                    val.forUser.username === elem.usernameReceiver && 
                    elem.usernameSender === UserDataManipulation.getLoggedInUser().getUsername() ) {                                          
                        return false;
                    }
                return true;
            });            
            localStorage.setItem('bookRecommendations', JSON.stringify(recommendations));            
        }
    }

    public static removeAllBookRecommedantionsForUser(): void {
        let x: string|null = localStorage.getItem('bookRecommendations');
        let recommendations: BookRecommendation[];        
        if ( x ) {
            recommendations = JSON.parse(x);
            recommendations = recommendations.filter((elem: BookRecommendation) => {                
                if ( elem.usernameReceiver === UserDataManipulation.getLoggedInUser().getUsername() )                        
                    return false;
                return true;
            });            
            localStorage.setItem('bookRecommendations', JSON.stringify(recommendations));            
        }
    }

}