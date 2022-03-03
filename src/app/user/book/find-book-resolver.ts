import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { Book } from "data/book/book";
import { BookDataManipulation } from "data/book/book-data-manipulation";
import { Comment, Comments } from "data/comments/comment";
import { CommentsDataManipulation } from "data/comments/comments-data-manipulation";
import { PathResolver } from "data/path-resolver";
import { UserDataManipulation } from "data/users/input.data";
import { Observable } from "rxjs";
import { LoadService } from "src/app/shared/services/load-service";
import { LoaderService } from "src/app/shared/services/modals/loader-service";
import { FinalResolver } from "src/app/shared/utilities/final-resolver";

@Injectable()
export class FindBookResolver extends FinalResolver<void> {

    protected override timeUntilShowingPage: number = 250;

    comments: Comments;
    userHasComment: boolean;
    userComment: Comment;
    book: Book;

    constructor(
        protected override loader: LoadService,
        private router: Router
    ) {
        super(loader);

    }

    public getNumberOfComments(): number {
        return this.comments.length + (this.userHasComment ? 1 : 0);        
    }

    protected _resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void> | Observable<Promise<void>> | Promise<Promise<void>> {
        return new Promise<void>((resolve, reject) => {    

            this.userHasComment = false;            
            
            // Get all comments for the given book.
            let slug: string = route.params['slug'];
            let book: Book | null = BookDataManipulation.getBookBySlug(slug);
            if ( book === null ) {
                this.router.navigate([PathResolver.getUserURLPrefix()]);
                resolve();
                return;
            }
            this.book = book;            
            let comments: Comment[];
            this.comments = [];
            comments = CommentsDataManipulation.getCommentsForBook(book);               
            
            // Check if user has left the comment            
            comments.forEach((comment: Comment) => {                
                if ( comment.user.username === UserDataManipulation.getLoggedInUser().username ) {                    
                    this.userHasComment = true;
                    this.userComment = comment;
                } else 
                    this.comments.push(comment);
            });            

            setTimeout(() => {                
                resolve();
            }, 800);
        });
    }
}