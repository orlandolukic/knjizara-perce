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

}