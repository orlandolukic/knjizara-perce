import { animate, AnimationMetadata, AnimationTriggerMetadata, keyframes, state, style, transition, trigger } from "@angular/animations";


export const animationFadeInRight: AnimationTriggerMetadata = trigger("fadeInRight", [    
    transition(":enter", [
        style({
            opacity: 0,
            transform: "translateX(50px)"
        }),
        animate("{{ duration }} {{ delay }} cubic-bezier(.69,.3,0,.99)", keyframes([
            style({
                opacity: 0,
                transform: "translateX(50px)",
                offset: 0
            }),
            style({
                opacity: 0.6,
                transform: "translateX(20px)",
                offset: 0.6
            }),
            style({
                opacity: 1,
                transform: "translateX(0)",
                offset: 1
            }),
        ]))
    ], {
        params: {
            duration: "600ms",
            delay: "350ms"
        }
    })
]);

const animationFadeInLeftMetadata: AnimationMetadata[] = [
    style({
        opacity: 0,        
        transform: "translateX(-50px)"
    }),
    animate("{{ duration }} {{ delay }} cubic-bezier(.69,.3,0,.99)", keyframes([
        style({
            opacity: 0,
            transform: "translateX(-50px)",
            offset: 0
        }),
        style({
            opacity: 0.6,
            transform: "translateX(-20px)",
            offset: 0.6
        }),
        style({
            opacity: 1,
            transform: "translateX(0)",
            offset: 1
        }),
    ]))
];

export const animationFadeInLeft: AnimationTriggerMetadata = trigger("fadeInLeft", [        
    transition(":enter", animationFadeInLeftMetadata, {
        params: {
            duration: "600ms",
            delay: "350ms"
        }
    })
]);

export const animationFadeInY: AnimationTriggerMetadata = trigger("fadeInY", [     
    transition(":enter", [
        style({
            opacity: 0,
            transform: "translateY({{ yStart }}px)"
        }),
        animate("{{ duration }} {{ delay }} cubic-bezier(.69,.3,0,.99)", keyframes([
            style({
                opacity: 0,
                transform: "translateY({{ yStart }}px)",
                offset: 0
            }),
            style({
                opacity: 0.6,
                transform: "translateY({{ yMiddle }}px)",
                offset: 0.6
            }),
            style({
                opacity: 1,
                transform: "translateY(0)",
                offset: 1
            }),
        ]))
    ], {
        params: {
            duration: "600ms",
            delay: "350ms",
            yStart: -50,
            yMiddle: -20
        }
    })
]);