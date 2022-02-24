import { EventEmitter, Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { LoaderComponent } from "../../components/loader/loader.component";

export interface LoaderServiceInstructions {
    beforeOpened?: (service: LoaderService) => void,
    afterOpened?: (service: LoaderService) => void,
    fetchData?: (service: LoaderService) => Promise<void>,
    shown?: (service: LoaderService) => void,
    transition?: boolean,
    transitionDelayShow?: number,
    transitionDelayHide?: number
}

@Injectable()
export class LoaderService {

    private loaderListenerOnShowInit: EventEmitter<void> = new EventEmitter();
    private loaderListenerOnShow: EventEmitter<LoaderServiceInstructions> = new EventEmitter();    
    private loaderListenerOnHide: EventEmitter<LoaderServiceInstructions> = new EventEmitter();   

    private subLoaderListenerOnShow: EventEmitter<void> = new EventEmitter(); 
    private subLoaderListenerOnHide: EventEmitter<void> = new EventEmitter(); 
    private loaderComponent: LoaderComponent;

    private isActivated: boolean;
    private allowToDismiss: boolean;
    private withTransition: boolean;

    constructor() {
        this.allowToDismiss = true; 
        this.withTransition = false;       
        this.isActivated = false;
    }

    public getLoaderListenerOnShow(): EventEmitter<LoaderServiceInstructions> { return this.loaderListenerOnShow; }
    public getLoaderListenerOnHide(): EventEmitter<LoaderServiceInstructions> { return this.loaderListenerOnHide; }
    public getLoaderListenerOnShowInit(): EventEmitter<void> { return this.loaderListenerOnShowInit; }

    // Communication between subloaders (i.e. DeleteLoader, SuccessfulLoader, etc.)
    public getSubLoaderListenerOnShow(): EventEmitter<void> { return this.subLoaderListenerOnShow; }
    public getSubLoaderListenerOnHide(): EventEmitter<void> { return this.subLoaderListenerOnHide; }

    public allowDismiss(): void { this.allowToDismiss = true; }
    public disallowDismiss(): void { this.allowToDismiss = false; }
    public isAllowedToDismiss(): boolean { return this.isActivated && this.allowToDismiss; }

    public showLoader(instr?: LoaderServiceInstructions): void {
        this.disallowDismiss();
        this.isActivated = true;        
        if ( instr ) {
            if ( instr.beforeOpened )            
                instr.beforeOpened(this);
            // Create transition inside loader
            if ( instr.transition ) {
                this.withTransition = true;
                this.loaderListenerOnShow.emit(instr);
                this.loaderComponent.setTransitionAndWait().then(() => {                                        
                    this._showLoaderLater(instr);
                });
            } else {
                this.loaderListenerOnShow.emit(instr);
                this._showLoaderLater(instr);     
            }
        } else {
            this.loaderListenerOnShow.emit(instr);
        }
    }

    private _showLoaderLater(instr: LoaderServiceInstructions): void {
        if ( instr.afterOpened )                   
            instr.afterOpened(this);
        if ( instr.fetchData )
            instr.fetchData(this).then(() => {
                this.subLoaderListenerOnShow.next();
                if ( instr.shown )
                    instr.shown(this);
                this.allowDismiss();
            });
        else {            
            this.subLoaderListenerOnShow.next();
            if ( instr.shown ) 
                instr.shown(this);
            this.allowDismiss();
        }
    }

    public setLoaderComponent(l: LoaderComponent): void {
        this.loaderComponent = l;
    }

    public hideLoader(force: boolean = false): Promise<void> {        
        
        if ( this.isActivated && force ) {
            this.withTransition = false;
        }

        return new Promise<void>((resolve, reject) => {
            if ( !this.isActivated ) {
                reject();
                return;
            }      
            this.isActivated = false; 

            if ( this.withTransition ) {                                
                this.subLoaderListenerOnHide.next();
                this.loaderComponent.setTransitionAndWaitToClose().then(() => {
                    this.loaderListenerOnHide.emit();
                    this.isActivated = false;
                    resolve();
                });  
                return;              
            }

            this.subLoaderListenerOnHide.next();
            this.loaderListenerOnHide.emit();            
            resolve();
        });    
    }
}