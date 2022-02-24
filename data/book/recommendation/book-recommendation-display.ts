import { UserBasicData } from "data/users/user-basic-data";
import { Book } from "../book";

export interface BookRecommendationDisplay {
    userWhichRecommended: UserBasicData | null,
    book: Book | null,
    date: Date
}