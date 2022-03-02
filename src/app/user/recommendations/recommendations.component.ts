import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faChevronRight, faGlobeEurope, faHourglass, faHouseUser, faPaperPlane, faQuestionCircle, faTimes, faTimesCircle, faTrashCan, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { BookRecommendationController } from 'data/book/recommendation/book-recommendation-controller';
import { SingleRecommendation, SingleRecommendationDetails, SingleRecommendationToDelete } from 'data/interfaces/single-recommendation';
import { UserBasicData } from 'data/users/user-basic-data';
import { LoaderDeleteComponent } from 'src/app/shared/components/loader/loader-delete/loader-delete.component';
import { LoaderSuccessfulComponent } from 'src/app/shared/components/loader/loader-successful/loader-successful.component';
import { LoaderService } from 'src/app/shared/services/modals/loader-service';
import { TitleService } from 'src/app/shared/services/title-service';
import { RecommendationsResolver } from './recommendations-resolver';
import { SingleRecommendationComponent } from './single-recommendation/single-recommendation.component';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent implements OnInit, OnDestroy {

  faHome: IconDefinition = faHouseUser;
  faChevronRight: IconDefinition = faChevronRight;
  faHourglass: IconDefinition = faHourglass;
  faQuestionMark: IconDefinition = faQuestionCircle;
  faTimes: IconDefinition = faTimesCircle;
  faCheck: IconDefinition = faCheckCircle;
  faTrashCanList: IconDefinition = faTrashCan;
  faPaperPlane: IconDefinition = faPaperPlane;

  recommendations: SingleRecommendation[];
  hasRecommendations: boolean;
  arr: any[];
  numberOfAllRecommendations: number;
  showDeleteLoader: boolean;
  showDeleteContent: boolean;
  startSuccessTransition: boolean;
  deleteText: string;
  private toDeleteIndex: number;  
  private toDeleteRecommendation: SingleRecommendationToDelete | null;
  private action: string;

  @ViewChild('loaderSuccessful', {read: LoaderSuccessfulComponent, static: true}) 
  loaderSuccessful: LoaderSuccessfulComponent;
  
  @ViewChild('loaderDelete', {read: LoaderDeleteComponent, static: true}) 
  loaderDelete: LoaderDeleteComponent;

  @ViewChildren('singleRecommendationElem', {read: SingleRecommendationComponent}) 
  singleRecommendationElem: QueryList<SingleRecommendationComponent>;


  constructor(
    private activatedRoute: ActivatedRoute,
    private titleService: TitleService,
    private recommendationsResolver: RecommendationsResolver,
    private cdr: ChangeDetectorRef
  ) { 
    
  }

  ngOnInit(): void {      
      this.recommendations = this.recommendationsResolver.getData();
      this.hasRecommendations = this.recommendations.length > 0;
      this.numberOfAllRecommendations = this.recommendationsResolver.getNumberOfAllRecommendations();
      this.titleService.changeTitle(`Moje preporuke (${this.numberOfAllRecommendations})`);
      this.showDeleteLoader = false;
      this.showDeleteContent = false;     
  }

  ngOnDestroy(): void {
     
  }
  
  onDelete(recommendation: SingleRecommendation, index: number, elem: SingleRecommendationToDelete): void {

    this.action = "deleteSingle";
    this.deleteText = "Da li ste sigurni da želite da obrišete preporuku?";    
    this.toDeleteIndex = index;
    this.toDeleteRecommendation = elem;      

    this.loaderDelete.getLoaderService().showLoader({      
      transition: true      
    }); 
  }

  deleteAllRecommendations(): void {
    this.deleteText = "Da li ste sigurni da želite da obrišete sve preporuke?";
    this.action = "deleteAll";
    this.loaderDelete.getLoaderService().showLoader({      
      transition: true      
    }); 
  }

  confirmDeleteRecommendation(): void {
    this.loaderDelete.getLoaderService().disallowDismiss();
    this.loaderSuccessful.getLoaderService().showLoader({      
      transition: true,
      fetchData: (service: LoaderService) => {
        return new Promise<void>((resolve, reject) => {
          if ( this.action === "deleteAll" ) {
            // Perform database delete operation for all recommendation which belong to current user
            // ...
            BookRecommendationController.removeAllBookRecommedantionsForUser();
          } else {
            // Perform database delete operation for specific recommendation which belongs to current user
            // ...            
            BookRecommendationController.removeBookRecommendation({
              book: this.recommendations[this.toDeleteIndex].book,
              forUser: this.recommendations[this.toDeleteIndex].recommendations[this.toDeleteRecommendation?.index!].user
            })            
          }
          setTimeout(() => {
            resolve();
          }, 800);
        });
      }
    })
  }

  declineDeleteRecommendation(): void {
    this.toDeleteIndex = -1;
    this.toDeleteRecommendation = null;    
    this.loaderDelete.getLoaderService().hideLoader();
  }

  // Successful loader
  dismissSuccessfulMessage(): void {
    this.loaderSuccessful.hideLoader(true).then(() => {      
      this.loaderDelete.hideLoader(false).then(() => {

          // Check if action was to delete all recommendations for current user
          if ( this.action === "deleteAll" ) {
            this._deleteAllRecommendations();
            return;
          }
          
          this.toDeleteRecommendation?.htmlElement?.nativeElement.remove();
          this.recommendations[this.toDeleteIndex].recommendations = this.recommendations[this.toDeleteIndex].recommendations.filter(
            (value: SingleRecommendationDetails, index: number) => {
            if ( index === this.toDeleteRecommendation?.index )
              return false;
            return true;
          });                   
          
          // Check if there are any left recommendations inside one-book group
          if ( this.recommendations[this.toDeleteIndex].recommendations.length === 0 ) {                

            // Delete element from screen            
            this.singleRecommendationElem.get(this.toDeleteIndex)?.hostElement.nativeElement.remove();  
            
            // Remove recommendation from current array.
            this.recommendations = this.recommendations.filter((sr: SingleRecommendation, index: number) => {
              if ( index === this.toDeleteIndex )
                return false;
              return true;
            });   
            
            if ( this.recommendations.length === 0 ) {
              // All recommendations have been deleted
              this.hasRecommendations = false;
            } else {            
              // Rearrange numbers inside the list 
              for(let i=this.toDeleteIndex; i < this.recommendations.length; i++) {              
                this.singleRecommendationElem.get(i)!.number = i+1;                              
              }
            }
          } else {
            // Remove element inside one-book recommendation group
            this.toDeleteRecommendation?.htmlElement?.nativeElement.remove();

            // Refresh number of recommendations for given one-book group
            this.singleRecommendationElem.get(this.toDeleteIndex)?.refreshRecommendationNumber();
          }          

          // Go and decrement number of all recommendations
          this.numberOfAllRecommendations--;
          this.refreshNumberOfRecommendations();
      }); 
    });
  }

  private refreshNumberOfRecommendations(): void {    
    this.titleService.changeTitle(`Moje preporuke (${this.numberOfAllRecommendations})`);
  }

  private _deleteAllRecommendations(): void {    
    this.recommendations = [];
    this.singleRecommendationElem.forEach((item: SingleRecommendationComponent) => {
      item.hostElement.nativeElement.remove();
    });
    this.hasRecommendations = false;
    this.numberOfAllRecommendations = 0;
  }

}
