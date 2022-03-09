import { animate, AnimationTransitionMetadata, keyframes, query, stagger, state, style, transition, trigger } from "@angular/animations";


export const animations: any[]  = [
    trigger('show', [
        state('void', style({
            opacity: 0            
        })),                        
        transition('void <=> *', [
            animate('0.6s 350ms cubic-bezier(1,.53,.59,.94)', keyframes([
                style({
                    opacity: 0,
                    transform: "scale3d(0.95,0.95,0.95) translateX(250px)",
                    offset: 0
                }),
                style({       
                    opacity: 0.2,             
                    transform: "scale3d(0.95,0.95,0.95) translateX(0px)",
                    offset: 0.5
                }),
                style({                    
                    opacity: 1,
                    transform: "scale3d(1,1,1) translateX(0)",
                    offset: 1
                })
            ]))                        
        ])
    ])
];