import { animate, AnimationTransitionMetadata, keyframes, query, stagger, state, style, transition, trigger } from "@angular/animations";


export const animations: any[]  = [
    trigger('show', [
        state('void', style({
            opacity: 0            
        })),                        
        transition('void <=> *', [
            animate('0.5s 350ms cubic-bezier(1,.53,.59,.94)', keyframes([
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
        transition('hidden <=> shown', [
            query('@fadeInContentChild', [
                style({opacity: 0}),
                stagger(250, [
                    animate('500ms ease'),
                    style({opacity: 1}),
                ])
            ])
        ])
    ])
];