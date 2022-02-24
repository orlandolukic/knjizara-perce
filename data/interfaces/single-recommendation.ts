import { ElementRef } from "@angular/core";
import { Book } from "data/book/book";
import { UserBasicData } from "data/users/user-basic-data";

export interface SingleRecommendationDetails { 
    date: Date,
    user: UserBasicData   
}

export interface SingleRecommendation {
    book: Book;
    recommendations: SingleRecommendationDetails[];
}

export interface SingleRecommendationToDelete {
    index: number;
    details: SingleRecommendationDetails;
    htmlElement?: ElementRef
}