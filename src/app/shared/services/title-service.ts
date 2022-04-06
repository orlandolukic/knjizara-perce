import { Type } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { AdminModule } from "src/app/admin/admin.module";

@Injectable({
    providedIn: "root"
})
export class TitleService {

    private titlePrefix: string = $localize `Knjizara PERCE`;

    constructor(
        private titleServiceImpl: Title
    ) {        
    }

    public changeTitle(x: string): void {
        if ( x === "" )             
            this.titleServiceImpl.setTitle(this.titlePrefix);
        else
            this.titleServiceImpl.setTitle(x + " | " + this.titlePrefix);
    }

}