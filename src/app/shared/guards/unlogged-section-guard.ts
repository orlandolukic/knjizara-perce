import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { User } from "data/users/user";
import { UserDataManipulation } from "data/users/input.data";
import { Observable } from "rxjs";


@Injectable()
export class UnloggedSectionGuard implements CanActivate {
    constructor(        
        private router: Router,
        @Inject(DOCUMENT) private document: Document
    ) {
        
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {   
        let user: any = sessionStorage.getItem("loggedInUser");
        if ( user === null ) {
            this.document.body.classList.remove('background-overlay');
            return true;
        } else {            
            this.document.body.classList.add('background-overlay');
            if ( user.type === User.BUYER )
                this.router.navigate(['user']);
            else 
                this.router.navigate(['admin']);
            return false;
        }                        
    }
}