import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { FinalResolver } from "src/app/shared/utilities/final-resolver";


@Injectable()
export class AllBooksResolver extends FinalResolver<void> {

    protected _resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void> | Observable<Promise<void>> | Promise<Promise<void>> {
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 200);
        }); 
    }   
}