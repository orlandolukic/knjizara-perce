import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { BookRecommendationDisplay } from "data/book/recommendation/book-recommendation-display";
import { SingleRecommendation } from "data/interfaces/single-recommendation";
import { Observable } from "rxjs";
import { LoadService } from "src/app/shared/services/load-service";
import { FinalResolver } from "src/app/shared/utilities/final-resolver";
import { BookRecommendationController } from "data/book/recommendation/book-recommendation-controller";
import { UserBasicData } from "data/users/user-basic-data";

@Injectable()
export class RecommendationsResolver extends FinalResolver<void> {

  private recommendations: SingleRecommendation[];
  private numberOfAllRecommendations: number;

  constructor(
    loader: LoadService
  ) {    
    super(loader);     
    this.recommendations = new Array<SingleRecommendation>();
    this.timeUntilShowingPage = 350;   
    this.numberOfAllRecommendations = 0;
  }

  public getData(): SingleRecommendation[] { return this.recommendations; }
  public getNumberOfAllRecommendations(): number { return this.numberOfAllRecommendations; }

  _resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
  Promise<void> | Observable<Promise<void>> | Promise<Promise<void>> {

    this.recommendations = new Array<SingleRecommendation>();

    // Go to the server and fetch data...
    let books: BookRecommendationDisplay[] =  BookRecommendationController.getAllRecommendationsForUser();
    this.numberOfAllRecommendations = books.length;
    
    books.forEach((val: BookRecommendationDisplay, index: number, array: BookRecommendationDisplay[]) => {
      let found = false;
      let foundedRecommendation: SingleRecommendation | null = null;
      this.recommendations.forEach((r: SingleRecommendation, j: number, arr: SingleRecommendation[]) => {
        if ( r.book!.id === val.book!.id ) {
          found = true;
          foundedRecommendation = r;
          return false;
        }
        return true;
      });

      if ( found ) {
        
        let alreadyIncluded: boolean = false;
        foundedRecommendation!.recommendations.forEach((e: {date: Date, user: UserBasicData | null}, j: number, arr: any[]) => {
          if ( e.user?.username === val.userWhichRecommended?.username )
            alreadyIncluded = true;
        });
        if ( alreadyIncluded )
          return;

        foundedRecommendation!.recommendations.push({
          date: val.date,
          user: val.userWhichRecommended!
        });
        
      } else {
        this.recommendations.push({
          book: val.book!,
          recommendations: [{
            date: val.date,
            user: val.userWhichRecommended!
          }]
        });
      }
    });

    return new Promise<void>((resolve, reject) => {      
      setTimeout(() => {
        resolve();
      }, 350);
    });
  }
  
}