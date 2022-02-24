import { BookDataManipulation } from "./book/book-data-manipulation";
import { UserDataManipulation } from "./users/input.data";

export class LocalStorage {

    public static clearData(): void {
        localStorage.clear();
    }

    public static initData(): void {
        UserDataManipulation.initData();
        BookDataManipulation.initData();
    }
    
}