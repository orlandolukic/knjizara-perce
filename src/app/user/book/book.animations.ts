import { animate, animateChild, AnimationTransitionMetadata, keyframes, query, sequence, stagger, state, style, transition, trigger } from "@angular/animations";


export const animations: any[]  = [
    trigger('show', [
        state('void', style({
            opacity: 0            
        })),                        
        transition('void <=> *', [
            animate('0.4s 100ms cubic-bezier(1,.53,.59,.94)', keyframes([
                style({
                    opacity: 0,
                    transform: "scale3d(0.85,0.85,0.85)",
                    offset: 0
                }),
                style({       
                    opacity: 0.4,             
                    transform: "scale3d(0.95,0.95,0.95)",
                    offset: 0.8
                }),
                style({                    
                    opacity: 1,
                    transform: "scale3d(1,1,1)",
                    offset: 1
                })
            ]))                        
        ])
    ]),

    trigger('fadeInContent', [        
        state('shown', style({
            opacity: 1
        })),
        state('hidden', style({
            opacity: 0
        })),
        transition('hidden => shown', [
            sequence([
                animate('0.5s ease'),
                query('@fadeInContentChild', [
                    stagger(300, [
                        style({opacity: 0}),
                        animate('0.3s', style({
                            opacity: 1
                        })),                        
                        style({opacity: 1})
                    ])
                ])
            ])            
        ])
    ]),

    trigger('fadeInContentChild', [              
        state('shown', style({
            opacity: 1
        })),
        state('hidden', style({
            opacity: 0
        }))                        
    ])
];