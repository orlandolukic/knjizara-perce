import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { FinalResolver } from "../utilities/final-resolver";



@Injectable()
export class BasicFinalResolver extends FinalResolver<void> {

    protected _resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void> | Observable<Promise<void>> | Promise<Promise<void>> {
        this.timeUntilShowingPage = 200 + Math.random() * 300;
        return new Promise<void>((resolve, reject) => {
            resolve();
        });
    }

}