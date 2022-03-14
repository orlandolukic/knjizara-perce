import { Component, EventEmitter, Output } from "@angular/core";
import { faCheck, faChevronRight, IconDefinition } from "@fortawesome/free-solid-svg-icons";

export class RegisterTasks {
    selectedTask: number;
    isReadyToSubmit: boolean;
    tasks: SingleTask[];
    activeSection: number;
    activeTask: SingleTask;

    constructor() {
        this.tasks = new Array<SingleTask>();  
        this.activeSection = 0;              
    }
}

@Component({
    template: ''
})
export abstract class SingleTask {

    faChevronRight: IconDefinition = faChevronRight;

    @Output()
    onStageChange: EventEmitter<number> = new EventEmitter();
    fieldGroupActive: number;

    constructor() {
        this.fieldGroupActive = 0;
    }

    abstract getStages(): string[];
    abstract verify(): boolean;
    abstract focusFirst(): void;
    
    submit(): void {
        if ( !this.verify() )
            return;
        this.onStageChange.emit(++this.fieldGroupActive)
    }
}