import { Inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { LoadService } from "../services/load-service";


@Injectable({
    providedIn: 'root'
})
export abstract class FinalResolver<T> implements Resolve<Promise<T>> {

    protected timeUntilShowingPage: number;
    private timeout: number;

    constructor(        
        protected loader: LoadService
    ) {        
        this.timeUntilShowingPage = 250;
        this.timeout = -1;
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<T> | Observable<Promise<T>> | Promise<Promise<T>> {
        
        window.clearTimeout(this.timeout);

        // Register resolver to the service.
        this.loader.registerResolver();

        // Get resolve from the extended class.
        let x: Promise<T> | Observable<Promise<T>> | Promise<Promise<T>> = this._resolve(route, state);

        // Handle returned value
        if ( x instanceof Promise ) {
            let promise: Promise<T> | Promise<Promise<T>> = x;
            return new Promise<T>((resolve, reject) => {
                promise.then((c: T | Promise<T>) => {
                    if ( c instanceof Promise ) {
                        c.then((cc: T) => {
                            this.loader.deregisterResolver(true);
                            this.timeout = window.setTimeout(() => {                                
                                this.loader.checkIfReadyToShow(true);
                            }, this.timeUntilShowingPage);
                            resolve(cc);
                        });  
                    } else {                        
                        this.loader.deregisterResolver(true);                        
                        this.timeout = window.setTimeout(() => {                                                        
                            this.loader.checkIfReadyToShow(true);                            
                        }, this.timeUntilShowingPage);
                        resolve(c);
                    }
                });                
            });
        } else if ( x instanceof Observable ) {
            // Add in case you'll need it later
        };
        return x;
    }

    protected abstract _resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
            Promise<T> | Observable<Promise<T>> | Promise<Promise<T>>;
}