import { Book } from "data/book/book";
import { UserDataManipulation } from "data/users/input.data";
import { Comment, Comments } from "./comment";


export class CommentsDataManipulation {

    public static getCommentsForBook(book: Book): Comments {
        let comments: Comments = [];

        let commentsStr: any = localStorage.getItem('comments');
        let commentsArr: Comment[];
        let comment: Comment;
        commentsArr = JSON.parse(commentsStr);    

        if ( commentsArr )        
            commentsArr.forEach((x: Comment) => {
                comment = x as Comment;
                comment.dateCreated = new Date(comment.dateCreated);
                comment.dateModified = new Date(comment.dateModified);
                if ( book.id === comment.bookID )
                    comments.push(comment);
            });        
        
        return comments;
    }

    public static getCommentForGivenBook(book: Book): Comment|null {
        let comments: Comments = [];

        let commentsStr: any = localStorage.getItem('comments');
        let commentsArr: Comment[];
        let comment: Comment|null = null;
        let xComment: Comment;
        commentsArr = JSON.parse(commentsStr);    

        if ( commentsArr )        
            commentsArr.forEach((x: Comment) => {
                xComment = x as Comment;
                if ( xComment.bookID === book.id && xComment.user.username === UserDataManipulation.getLoggedInUser().username ) {
                    comment = xComment;
                }
            });        
        
        return comment;
    }

    public static insertComment(c: Comment, operation: 'edit' | 'insert'): void {
        let commentsStr: any = localStorage.getItem('comments');
        let commentsArr: Comment[];        
        let xComment: Comment;
        commentsArr = JSON.parse(commentsStr);    

        if ( commentsArr ) {
            if ( operation === 'edit' )
                commentsArr.forEach((x: Comment) => {
                    xComment = x as Comment;
                    if ( xComment.bookID === c.bookID && xComment.user.username === UserDataManipulation.getLoggedInUser().username ) {
                        xComment.dateModified = c.dateModified;
                        xComment.rating = c.rating;
                        xComment.text = c.text;             
                    }
                }); 
            else 
                commentsArr.push(c);
        } else {
            commentsArr = new Array<Comment>();
            commentsArr.push(c);
        }
        localStorage.setItem('comments', JSON.stringify(commentsArr));
    }

}