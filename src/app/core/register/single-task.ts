import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, QueryList, ViewChildren } from "@angular/core";
import { faCheck, faChevronRight, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { stageChangeAnimation } from "./animations";

export class RegisterTasks {
    selectedTask: number;
    isReadyToSubmit: boolean;
    tasks: SingleTask[];
    activeSection: number;
    activeTask: SingleTask;
    activeStage: number;

    constructor() {
        this.tasks = new Array<SingleTask>();  
        this.activeSection = 0;  
        this.activeStage = -1;            
    }
}

@Component({
    template: '',
    animations: [
        stageChangeAnimation
    ]
})
export abstract class SingleTask implements OnInit {

    @ViewChildren('fieldGroup', {read: ElementRef}) fieldGroups: QueryList<ElementRef>;

    faChevronRight: IconDefinition = faChevronRight;

    @Output()
    private onSubmit: EventEmitter<void> = new EventEmitter();

    @Output()
    private stageChange: EventEmitter<number> = new EventEmitter();

    numberOfStages: number;
    protected currentStage: number;
    protected index: number;
    protected hasStages: boolean;

    animations: any[];

    constructor(
        stages: Number, 
        private host: ElementRef
    ) {
        this.numberOfStages = stages.valueOf();
        this.currentStage = 0;
        this.animations = [];
        this.hasStages = stages > 0;

        this.animations[0] = { value: 'stageLoaded' };
        for (let i=1; i<this.numberOfStages; i++)
            this.animations[i] = { value: 'stageNotLoaded' };
    }

    ngOnInit(): void {
        
    }

    abstract getStages(): string[];
    abstract verify(): boolean;
    abstract focusFirst(): void;
    abstract initStartupAnimation(): void;
    
    submit(): void {
        if ( !this.verify() )
            return;
        
        if ( !this.hasStages ) {            
            this.onSubmit.emit();
            return;
        }

        let current: number = this.currentStage;
        this.currentStage++;

        // Animate current form to exit
        let width: number = this.fieldGroups.get(current)?.nativeElement.offsetWidth;            
        this.animations[current] = {
            value: 'stageAfterExit',
            params: {
                duration: "500ms",
                delay: "150ms",
                xMiddle: -30,
                xEnd: -width
            }
        };

        if ( this.currentStage === this.numberOfStages ) {
            console.log("on submit");
            this.onSubmit.emit();
        } else {            
            this.animations[current+1] = {
                value: 'stageLoaded',
                params: {                    
                    delay: "650ms"                    
                }
            };
            this.stageChange.emit(current+1);
        }
    }

    @HostListener('@stageChange.done', ['$event', 'number'])
    doneAnimating(event: any, i: number) {        
        this.focusFirst();
    }

    setIndex(index: number): void {
        this.index = index;
    }

    public getIndex(): number {
        return this.index;
    }
}