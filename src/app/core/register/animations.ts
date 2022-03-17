import { animate, AnimationMetadata, AnimationTriggerMetadata, keyframes, state, style, transition, trigger } from "@angular/animations";

export const sectionChangeAnimation: AnimationTriggerMetadata = trigger("sectionChange", [
    state("sectionNotLoaded", style({
        opacity: 0,
        transform: "translateX({{ initTranslateX }}px)"
    }), {
        params: {
            initTranslateX: 250
        }
    }),

    state("sectionLoaded", style({
        transform: "translateX({{ currentTranslateX }}px)",
        opacity: 1
    }), {
        params: {
            currentTranslateX: 0
        }
    }),

    state("sectionOnExit", style({
        transform: "translateX({{ exitTranslateX }}px)",
        opacity: 0
    }), {
        params: {
            exitTranslateX: -250
        }
    }),

    transition("sectionNotLoaded => sectionLoaded", [
        animate("{{duration}}ms {{delay}}ms cubic-bezier(.69,.3,0,.99)")
    ], {
        params: {
            duration: 800,
            delay: 0
        }
    })
]);

export const stageChangeAnimation: AnimationMetadata = trigger("stageChange", [
    
    state('stageStartNotLoaded', style({
        opacity: 0,                      
        transform: "translateX(150px)"
    })),

    state('stageNotLoaded', style({
        opacity: 0,         
        display: "none",       
        transform: "translateX(150px)"
    })),

    state("stageLoaded", style({
        opacity: 1,
        transform: "translateX(0px)"       
    })),
    
    transition("stageNotLoaded => stageLoaded,stageStartNotLoaded => stageLoaded", [    
        style({
            opacity: 0,
            display: "block",
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
    }),

    transition("stageLoaded => stageAfterExit", [
        animate("{{ duration }} {{ delay }} cubic-bezier(.69,.3,0,.99)", keyframes([
            style({
                opacity: 0,
                transform: "translateX(0)",
                offset: 0
            }),
            style({
                opacity: 0.6,
                transform: "translateX(-20px)",
                offset: 0.6
            }),
            style({
                opacity: 1,
                transform: "translateX(-50px)",
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