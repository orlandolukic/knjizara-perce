import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { User } from "data/users/user";
import { UserDataManipulation } from "data/users/input.data";


@Injectable()
export class AdminSectionGuard implements CanActivate {

    constructor(        
        private router: Router,
        @Inject(DOCUMENT) private document: Document
    ) {
        
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {   
        let user: any = sessionStorage.getItem("loggedInUser");
        user = JSON.parse(user);
        if ( user !== null ) {            
            let x: boolean = UserDataManipulation.isUserPresent( user.username, user.password );                 
            if ( !x ) {
                this.document.body.classList.remove('background-overlay');
                this.router.navigate(['login']);
                return false;
            }
            this.document.body.classList.add('background-overlay');
            if ( user.type === User.ADMIN )
                return true;
            else {
                this.router.navigate(['user']);
                return false;
            }            
        } else {
            this.document.body.classList.remove('background-overlay');
            this.router.navigate(['login']);
            return false;            
        }                        
    }
}