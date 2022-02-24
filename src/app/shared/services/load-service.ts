import { EventEmitter, Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { AppModule } from "src/app/app.module";

@Injectable({
    providedIn: 'root'
})
export class LoadService {

    private inTransition: boolean;
    private firstTime: boolean;
    private resolvers: number;
    private eventEmitter: EventEmitter<string>;
    private checkAfter: number;

    constructor() {
        this.resolvers = 0;
        this.checkAfter = 0;
        this.firstTime = true;
        this.inTransition = false;
        this.eventEmitter = new EventEmitter<string>();
    }

    public setTransition(): void {
        if ( !this.inTransition || this.firstTime ) {
            this.startLoading();
            this.firstTime = false;
        }
        this.inTransition = true;        
    }

    public resetTransition(): void {
        this.inTransition = false;
    }

    public registerResolver(): void {
        if ( this.resolvers == 0 || this.firstTime ) {
            this.startLoading();
            this.firstTime = false;
        }
        this.resolvers++;
    }

    public deregisterResolver(addToCheckAfter: boolean = false): void {
        this.resolvers--;        
        if ( addToCheckAfter ) {
            this.checkAfter++;
        }
    }

    public checkIfReadyToShow(checkedAfter: boolean = false): void {        
        if ( checkedAfter ) {
            this.checkAfter--;
        }

        if ( this.resolvers == 0 && !this.inTransition &&  this.checkAfter === 0 ) {
            this.finishLoading();
        }
    }

    public subscribe( n: (value: string) => void ): Subscription {
        return this.eventEmitter.subscribe(n);
    }

    public startLoading(): void {
        this.eventEmitter.emit("START");
    }

    public finishLoading(): void {
        if ( this.resolvers > 0 )
            return;
        this.eventEmitter.emit("FINISH");
    }

}