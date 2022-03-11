import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

export const bookSliderSingleBookAnimations = [
    trigger("showBook", [      
      state("shown", style({opacity: 1})),      
      state("start", style({
        opacity: 0,
        transform: "scale3d(0.7,0.7,0.7)"
      })),
      transition("* => animating", [        
        animate("{{duration}} {{delay}} cubic-bezier(.14,.56,.37,.98)", keyframes([
          style({
            opacity: 0, 
            transform: "scale3d(0.7,0.7,0.7)", 
            offset: 0
          }),
          style({  
            opacity: 0.2,          
            transform: "scale3d(1,1,1)", 
            offset: 0.3
          }),          
          style({  
            opacity: 0.6,          
            transform: "scale3d(1.1,1.1,1.1)", 
            offset: 0.4
          }),
          style({
            opacity: 1,
            transform: "scale3d(1,1,1)",
            offset: 1
          })
        ]))
      ], {
        params: {
            delay: "0ms",
            duration: "600ms"
        }
      })
    ])
  ];