import { Book } from "./book/book";
import { UserDataManipulation } from "./users/input.data";
import { User } from "./users/user";

export class PathResolver {

    public static PROFILE_PICTURE_DIRECTORY: string = "assets/images/user-images/";
    public static BOOK_PICTURE_DIRECTORY: string = "assets/images/books/";

    public static getPathForBook(book: Book): string {
        let s: string = "/";
        let user: User = UserDataManipulation.getLoggedInUser();
        if ( user.isBuyer() ) {
            s += "user/";
        } else {
            s += "admin/";
        }
        s += "book/" + book.slug;
        return s;
    }

}