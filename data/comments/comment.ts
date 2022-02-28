import { Book } from "data/book/book";
import { UserBasicData } from "data/users/user-basic-data";

export interface Comment {
    rating: number;
    user: UserBasicData;
    text: string;
    dateCreated: Date
    dateModified: Date,
    bookID: number
}

export type Comments = Comment[];

/*

comments.push({
    rating: 4,
    user: {username: 'filip', name: 'Filip', surname: 'Petrovic', image: ''},
    text: "ovo je strava komentar",
    dateCreated: new Date(),
    dateModified: null,
    bookID: 2
})
comments.push({
    rating: 5,
    user: {username: 'ivana', name: 'Ivana', surname: 'Djordjevic', image: ''},
    text: "Zastrasujuca knjiga...... mnogo mi se dpala!",
    dateCreated: new Date(),
    dateModified: null,
    bookID: 2
})
*/